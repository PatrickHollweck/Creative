using System;
using System.IO;
using System.Timers;
using System.Threading.Tasks;
using System.Collections.Generic;

using StatoBot.Core;
using StatoBot.Reports;
using StatoBot.Analytics;
using StatoBot.Reports.Formatters;

namespace StatoBot.Terminal
{
    internal static class Program
    {
        private static async Task Main()
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

            var bot = new AnalyzerBot(ReadCredentials(credentialsPath), channelName);

			string basePath = Path.Combine(Directory.GetCurrentDirectory(), "statistics");
            if (!Directory.Exists(basePath))
            {
                Directory.CreateDirectory(basePath);
            }

			var statisticsWriter = new ReportWriter(
				$"{basePath}/{bot.Channel}/",
				bot.Analyzer,
				new List<IReportFormatter>() {
					new JsonFormatter(),
					new MarkdownFormatter()
				}
			);

			var timer = new Timer(15_000)
			{
				AutoReset = true,
				Enabled = true
			};

			timer.Elapsed += (sender, e) =>
			{
				UpdateTitle();
				statisticsWriter.Save(bot);
			};

            bot.OnMessageReceived += (_, args) => LogMessage(args.Message);

            await bot.SetupAndListenAsync();
        }

		private static Credentials ReadCredentials(string credentialsPath)
		{
            try
            {
				return Credentials.FromFile(credentialsPath);
            }
            catch (Exception e)
            {
                Console.Write("Failed to load credentials: \n" + e.Message);
                Console.Read();

				throw;
            }
		}

        private static void UpdateTitle()
        {
            Console.Title = "StatoBot - Last Save: " + DateTime.Now;
            Console.BackgroundColor = ConsoleColor.Yellow;
            Console.ForegroundColor = ConsoleColor.Black;

            Console.WriteLine("------ S A V E D ------");

            Console.BackgroundColor = ConsoleColor.Black;
            Console.ForegroundColor = ConsoleColor.White;
        }

        private static void LogMessage(TwitchMessage message)
        {
            if (message.IsChatMessage)
            {
                Console.WriteLine(message.Author.PadRight(30) + " ::: " + message.Content);
            }
            else
            {
                Console.WriteLine("TWITCH_SYSTEM ::: " + message.RawMessage);
            }
        }
    }
}
