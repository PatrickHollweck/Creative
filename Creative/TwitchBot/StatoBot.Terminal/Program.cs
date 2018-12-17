using System;
using System.IO;
using System.Threading.Tasks;

using StatoBot.Core;
using StatoBot.Reports;
using StatoBot.Analytics;
using StatoBot.Reports.Formatters;

namespace StatoBot.Terminal
{
	internal class Program
	{
		private static void Main()
		{
			Task.Run(MainAsync).Wait();
		}

		private static async Task MainAsync()
		{
			UpdateTitle();

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
				credentials = Credentials.FromFile(credentialsPath);
			}
			catch (Exception e)
			{
				Console.Write("Failed to load credentials: \n" + e.Message);
				Console.Read();
				return;
			}

			var bot = new AnalyzerBot(credentials, channelName);
			var timeout = new Timeout(TimeSpan.FromSeconds(-60));

			const string basePath = "./statistics";
			if (!Directory.Exists(basePath))
			{
				Directory.CreateDirectory(basePath);
			}

			var saver = new StatisticsSaver($"{basePath}/{bot.Channel}_stats.json", bot.Analyzer);

			bot.Analyzer.OnStatisticsChanged += (e) =>
			{
				if (!timeout.IsOver())
				{
					return;
				}

				WriteReport(bot);
				UpdateTitle();
				saver.Save();
			};

			bot.OnMessageReceived += LoggingHook;

			await bot.SetupAndListenAsync();
		}

		private static void UpdateTitle()
		{
			Console.Title = "StatoBot - Last Save: " + DateTime.Now;
		}

		private static void WriteReport(AnalyzerBot bot)
		{
			File.WriteAllText($"./statistics/{bot.Channel}_chat_report.md", ReportGenerator.ForAnalyzingBot(bot).FormatWith<MarkdownFormatter>());
		}

		private static void LoggingHook(OnMessageReceivedEventArgs e)
		{
			if (e.IsChatMessage)
			{
				Console.WriteLine(e.Author.PadRight(40) + " ::: " + e.Content);
			}
			else
			{
				Console.WriteLine("TWITCH_SYSTEM ::: " + e.RawMessage);
			}
		}
	}
}
