using System;
using System.Threading.Tasks;

using Discord;
using Discord.WebSocket;

namespace NoFlakeBot.Core
{
	public class NoFlakeDiscordBot : DiscordBot
	{
		public NoFlakeDiscordBot(Config config) : base(config)
		{
			Client.Log += Log;
			Client.MessageReceived += MessageReceived;
		}

		private Task MessageReceived(SocketMessage message)
		{
			Console.WriteLine($"USER -*- {message.Author} -> {message.Channel} :: {message.Content}");

			return Task.CompletedTask;
		}

		private Task Log(LogMessage message)
		{
			void SetConsoleColor(ConsoleColor background, ConsoleColor foreground = ConsoleColor.White)
			{
				Console.BackgroundColor = background;
				Console.ForegroundColor = foreground;
			}

			switch (message.Severity)
			{
				case LogSeverity.Critical:
					SetConsoleColor(ConsoleColor.DarkRed);
					break;
				case LogSeverity.Error:
					SetConsoleColor(ConsoleColor.Red);
					break;
				case LogSeverity.Warning:
					SetConsoleColor(ConsoleColor.Yellow);
					break;
				case LogSeverity.Info:
					SetConsoleColor(ConsoleColor.Blue);
					break;
				default:
					SetConsoleColor(ConsoleColor.White);
					break;
			}

			var exceptionSuffix = message.Exception == null ? "" : $"Exception:\n {message.Exception}";
			Console.WriteLine($"{message.Severity} ({message.Source}) :: {message.Message} {exceptionSuffix}");

			SetConsoleColor(ConsoleColor.Black);

			return Task.CompletedTask;
		}
	}
}
