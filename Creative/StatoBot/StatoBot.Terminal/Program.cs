using System;
using System.IO;
using System.Threading.Tasks;

using StatoBot.Core;
using StatoBot.Reports;
using StatoBot.Analytics;
using StatoBot.Reports.Formatters;

namespace StatoBot.Terminal
{
    internal static class Program
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

            bot.Analyzer.OnStatisticsChanged += (_) =>
            {
                if (!timeout.IsOver())
                {
                    return;
                }

                WriteReport(bot);
                UpdateTitle();
                saver.Save();
            };

            bot.OnMessageReceived += (_, args) => LoggingHook(args.Message);

            await bot.SetupAndListenAsync();
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

        private static void WriteReport(AnalyzerBot bot)
        {
            File.WriteAllText(
                $"./statistics/{bot.Channel}_chat_report.md",
                ReportGenerator.FromBot(bot).FormatWith<MarkdownFormatter>()
            );
        }

        private static void LoggingHook(TwitchMessage message)
        {
            if (message.IsChatMessage)
            {
                Console.WriteLine(message.Author.PadRight(40) + " ::: " + message.Content);
            }
            else
            {
                Console.WriteLine("TWITCH_SYSTEM ::: " + message.RawMessage);
            }
        }
    }
}
