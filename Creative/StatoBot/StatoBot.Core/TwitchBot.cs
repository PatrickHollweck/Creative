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

        private readonly Credentials credentials;
        public readonly string Channel;

        protected TcpClient Socket;
        protected StreamReader InputStream;
        protected StreamWriter OutputStream;

        public event Action<OnMessageReceivedEventArgs> OnMessageReceived;

        public TwitchBot(Credentials credentials, string channel)
        {
            this.credentials = credentials;

            Channel = channel;
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
            OnMessageReceived += RespondToPing;

            while (!InputStream.EndOfStream)
            {
                OnMessageReceived?.Invoke(
                    OnMessageReceivedEventArgs.FromRawMessage(await InputStream.ReadLineAsync(), this)
                );
            }

            OnMessageReceived -= RespondToPing;
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

        private async void RespondToPing(OnMessageReceivedEventArgs args)
        {
            var match = new Regex("^PING :(.*)$", RegexOptions.Compiled)
                            .Match(args.Message.RawMessage);

            if (match.Success)
            {
                await WriteToSystemAsync($"PONG {match.NextMatch()}");
            }
        }
    }
}
