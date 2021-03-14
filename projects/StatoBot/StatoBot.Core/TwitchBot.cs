using System;
using System.IO;
using System.Net.Sockets;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace StatoBot.Core
{
    public class TwitchBot : IDisposable
    {
        public const string TwitchHost = "irc.twitch.tv";
        public const int TwitchPort = 6667;

        public readonly string Channel;

		public DateTime StartTime { get; protected set; }

        protected TcpClient Socket;
        protected StreamReader InputStream;
        protected StreamWriter OutputStream;

		protected TwitchMessageParser MessageParser;
		protected Regex PingRegex = new Regex("^PING :(.*)$", RegexOptions.Compiled);

        private readonly Credentials credentials;

        public event EventHandler<OnMessageReceivedEventArgs> OnMessageReceived;

        public TwitchBot(Credentials credentials, string channel)
        {
            this.credentials = credentials;

            Channel = channel;
			MessageParser = new TwitchMessageParser(Channel);
        }

        public async Task SetupAndListenAsync()
        {
            await ConnectSocketAsync();
            await LoginAsync();
            await StartReadAsync();
        }

        public async Task ConnectSocketAsync()
        {
            Socket = new TcpClient();
            await Socket.ConnectAsync(TwitchHost, TwitchPort);

            InputStream = new StreamReader(Socket.GetStream());
            OutputStream = new StreamWriter(Socket.GetStream());

			StartTime = DateTime.Now;
        }

        public async Task LoginAsync()
        {
            await WriteToSystemAsync($"PASS {credentials.OAuthToken}");
            await WriteToSystemAsync($"NICK {credentials.UserName}");
            await WriteToSystemAsync($"USER {credentials.UserName} 0 * {credentials.UserName}");
            await WriteToSystemAsync($"JOIN #{Channel}");
        }

        public async Task WriteToSystemAsync(string message)
        {
            await OutputStream.WriteLineAsync(message);
            await OutputStream.FlushAsync();
        }

        public async Task WriteToChatAsync(string message)
        {
            await WriteToSystemAsync($"PRIVMSG #{Channel} :{message}");
        }

        public async Task StartReadAsync()
        {
			void pingResponder(object _, OnMessageReceivedEventArgs args) => RespondToPing(args.Message);
			OnMessageReceived += pingResponder;

            while (!InputStream.EndOfStream)
            {
                OnMessageReceived?.Invoke(
                    this,
                    new OnMessageReceivedEventArgs(
						MessageParser.Parse(await InputStream.ReadLineAsync()),
						this
					)
                );
            }

            OnMessageReceived -= pingResponder;
        }

        public void Stop()
        {
            Socket.GetStream().Close();
            Socket.Close();
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            InputStream.Dispose();
            OutputStream.Dispose();

            Socket.Dispose();
        }

        private async void RespondToPing(TwitchMessage message)
        {
            var match = PingRegex.Match(message.RawMessage);

            if (match.Success)
            {
                await WriteToSystemAsync($"PONG {match.NextMatch()}");
            }
        }
    }
}
