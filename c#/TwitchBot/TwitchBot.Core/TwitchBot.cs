using System;
using System.IO;
using System.Net.Sockets;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace TwitchBot.Core
{
	public class TwitchBot : IDisposable
	{
		public const string TWITCH_HOST = "irc.twitch.tv";
		public const int TWITCH_PORT = 6667;

		private readonly Credentials credentials;

		public readonly DateTime StartTime;
		public DateTime EndTime
		{
			get => DateTime.Now;
		}

		public readonly string Channel;

		public TcpClient Socket;

		public StreamReader InputStream;
		public StreamWriter OutputStream;

		public event Func<OnMessageReceivedEventArgs, Task> OnMessageReceived;

		public TwitchBot(Credentials credentials, string channel)
		{
			this.credentials = credentials;

			this.Channel = channel;
			this.StartTime = DateTime.Now;
		}

		public async Task SetupAndListenAsync()
		{
			await this.ConnectSocketAsync();
			await this.LoginAsync();
			await this.StartReadAsync();
		}
		
		public async Task ConnectSocketAsync()
		{
			this.Socket = new TcpClient();
			await this.Socket.ConnectAsync(TWITCH_HOST, TWITCH_PORT);

			this.InputStream = new StreamReader(this.Socket.GetStream());
			this.OutputStream = new StreamWriter(this.Socket.GetStream());
		}

		public async Task LoginAsync()
		{
			await this.WriteToSystemAsync($"PASS {this.credentials.OAuthToken}");
			await this.WriteToSystemAsync($"NICK {this.credentials.Username}");
			await this.WriteToSystemAsync($"USER {this.credentials.Username} 0 * {this.credentials.Username}");
			await this.WriteToSystemAsync($"JOIN #{this.Channel}");
		}

		public async Task WriteToSystemAsync(string message)
		{
			await this.OutputStream.WriteLineAsync(message);
			await this.OutputStream.FlushAsync();
		}

		public async Task WriteToChatAsync(string message)
		{
			await this.WriteToSystemAsync($"PRIVMSG #{this.Channel} :{message}");
		}

		public async Task StartReadAsync()
		{
			this.OnMessageReceived += RespondToPing;

			while (!this.InputStream.EndOfStream)
			{
				if (this.OnMessageReceived == null) return;

				await this.OnMessageReceived?.Invoke(
					new OnMessageReceivedEventArgs(await this.InputStream.ReadLineAsync(), this)
				);
			}

			this.OnMessageReceived -= RespondToPing;
		}

		public void Dispose()
		{
			this.InputStream.Dispose();
			this.OutputStream.Dispose();

			this.Socket.Dispose();
		}

		private async Task RespondToPing(OnMessageReceivedEventArgs args)
		{
			var match = new Regex(@"^PING :(.*)$").Match(args.RawMessage);
			if (match.Success)
			{
				await this.WriteToSystemAsync($"PONG " + match.NextMatch());
			}
		}
	}
}
