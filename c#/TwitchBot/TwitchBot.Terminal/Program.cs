using System;
using System.IO;
using TwitchBot.Analytics;
using TwitchBot.Core;

namespace TwitchBot.Terminal
{
	class Program
	{
		static void Main(string[] args)
		{
			Console.WindowWidth = 200;

			Console.Write("Input the channel name you want stats for: ");
			string channelName = Console.ReadLine();

			var credentialsPath = "./twitch_credentials.json";
			if (!File.Exists(credentialsPath))
			{
				Console.Write("Input the path where your twitch credentials are stored: ");
				credentialsPath = Console.ReadLine();
			}


			Credentials credentials;
			try
			{
				credentials = CredentialsLoader.LoadFromFile(credentialsPath);
			}
			catch (Exception e)
			{
				Console.Write("Failed to load credentials: \n" + e.Message);
				Console.Read();
				return;
			}

			AnalyzerBot bot = new AnalyzerBot(credentials, channelName);
			bot.OnMessageReceived += LoggingHook;
			bot.EnableStatsAutosaving();
			bot.SetupAndListen();
		}

		private static void LoggingHook(OnMessageReceivedEventArgs e)
		{
			if (e.IsChatMessage)
			{
				Console.WriteLine(e.Username.PadRight(40) + " ::: " + e.Content);
			}
			else
			{
				Console.WriteLine(e.RawMessage);
			}
		}
	}
}
