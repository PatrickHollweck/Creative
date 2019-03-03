using System.IO;
using Newtonsoft.Json;
using StatoBot.Analytics;

namespace StatoBot.Reports
{
    public static class ReportGenerator
    {
        public static Report FromBot(AnalyzerBot bot)
        {
            return new Report(
                new ReportInput(
                    bot.Analyzer.Statistics,
                    BotInfo.FromBot(bot)
                )
            );
        }

        public static Report FromData(ReportInput input)
        {
            return new Report(input);
        }
    }
}
