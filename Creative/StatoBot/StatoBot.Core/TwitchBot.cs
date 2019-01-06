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

		private DateTime? endTime;
		public DateTime StartTime { get; }
		public DateTime EndTime => endTime ?? DateTime.Now;

		protected TcpClient Socket;
		protected StreamReader InputStream;
		protected StreamWriter OutputStream;

		public event Action<OnMessageReceivedEventArgs> OnMessageReceived;

		public TwitchBot(Credentials credentials, string channel)
		{
			this.credentials = credentials;

			Channel = channel;
			StartTime = DateTime.Now;
		}

		public async Task SetupAndListenAsync()
		{
			await ConnectSocketAsync();
			await LogOnAsync();
			await StartReadAsync();
		}
		
		public async Task ConnectSocketAsync()
		{
			Socket = new TcpClient();
			await Socket.ConnectAsync(TwitchHost, TwitchPort);

			InputStream = new StreamReader(Socket.GetStream());
			OutputStream = new StreamWriter(Socket.GetStream());
		}

		public async Task LogOnAsync()
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
					new OnMessageReceivedEventArgs(await InputStream.ReadLineAsync(), this)
				);
			}

			OnMessageReceived -= RespondToPing;
		}

		public void Stop()
		{
			endTime = DateTime.Now;
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
			var match = new Regex(@"^PING :(.*)$").Match(args.RawMessage);
			if (match.Success)
			{
				await WriteToSystemAsync($"PONG " + match.NextMatch());
			}
		}
	}
}
