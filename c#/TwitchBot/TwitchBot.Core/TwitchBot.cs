using System;
using System.IO;
using System.Net.Sockets;
using System.Text.RegularExpressions;
using TwitchBot.Core;

namespace TwitchBot
{
	public class TwitchBot : IDisposable
	{
		public const string TWITCH_HOST = "irc.twitch.tv";
		public const int TWITCH_PORT = 6667;

		private Credentials credentials;

		public readonly string Channel;

		public TcpClient Socket;

		public StreamReader InputStream;
		public StreamWriter OutputStream;

		public event Action<OnMessageReceivedEventArgs> OnMessageReceived;

		public TwitchBot(Credentials credentials, string channel)
		{
			this.credentials = credentials;
			this.Channel = channel;
		}

		public void SetupAndListen()
		{
			this.ConnectSocket();
			this.Login();
			this.StartRead();
		}
		
		public void ConnectSocket()
		{
			this.Socket = new TcpClient();
			this.Socket.Connect(TWITCH_HOST, TWITCH_PORT);

			this.InputStream = new StreamReader(this.Socket.GetStream());
			this.OutputStream = new StreamWriter(this.Socket.GetStream());
		}

		public void Login()
		{
			this.WriteToSystem($"PASS {this.credentials.OAuthToken}");
			this.WriteToSystem($"NICK {this.credentials.Username}");
			this.WriteToSystem($"USER {this.credentials.Username} 0 * {this.credentials.Username}");
			this.WriteToSystem($"JOIN #{this.Channel}");
		}

		public void WriteToSystem(string message)
		{
			this.OutputStream.WriteLine(message);
			this.OutputStream.Flush();
		}

		public void WriteToChat(string message)
		{
			this.WriteToSystem($"PRIVMSG #{this.Channel} :{message}");
		}

		public void StartRead()
		{
			this.OnMessageReceived += RespondToPing;

			while (!this.InputStream.EndOfStream)
			{
				this.OnMessageReceived.Invoke(
					new OnMessageReceivedEventArgs(this.InputStream.ReadLine(), this.Channel)
				);
			}

			this.OnMessageReceived -= RespondToPing;
		}

		public bool IsConnected()
		{
			return this.Socket.Connected;
		}

		public void Dispose()
		{
			this.InputStream.Dispose();
			this.OutputStream.Dispose();

			this.Socket.Dispose();
		}

		private void RespondToPing(OnMessageReceivedEventArgs args)
		{
			var match = new Regex(@"^PING :(.*)$").Match(args.RawMessage);
			if (match.Success)
			{
				this.WriteToSystem($"PONG " + match.NextMatch());
			}
		}
	}
}
