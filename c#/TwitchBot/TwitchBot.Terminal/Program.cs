using System;
using System.IO;
using System.Threading.Tasks;
using TwitchBot.Analytics;
using TwitchBot.Core;

namespace TwitchBot.Terminal
{
	internal class Program
	{
		public static void Main()
		{
			Task.Run(MainAsync).Wait();
		}

		private static async Task MainAsync()
		{
			Console.WindowWidth = 200;

			Console.Write("Input the channel name you want stats for: ");
			var channelName = Console.ReadLine();

			var credentialsPath = "./twitch_credentials.json";
			if (!File.Exists(credentialsPath))
			{
				Console.Write("Input the path where your twitch credentials are stored: ");
				credentialsPath = Console.ReadLine();
			}

			Credentials credentials;
			try
			{
				credentials = CredentialsLoader.FromFile(credentialsPath);
			}
			catch (Exception e)
			{
				Console.Write("Failed to load credentials: \n" + e.Message);
				Console.Read();
				return;
			}

			var bot = new AnalyzerBot(credentials, channelName);
			bot.EnableStatsAutosaving();
			bot.OnSave += () => Console.Title = "StatoBot - Last Save: " + DateTime.Now;
			bot.OnMessageReceived += LoggingHook;
			await bot.SetupAndListenAsync();
		}

		private static Task LoggingHook(OnMessageReceivedEventArgs e)
		{
			if (e.IsChatMessage)
			{
				Console.WriteLine(e.Author.PadRight(40) + " ::: " + e.Content);
			}
			else
			{
				Console.WriteLine(e.RawMessage);
			}

			return Task.CompletedTask;
		}
	}
}
