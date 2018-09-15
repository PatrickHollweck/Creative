using System.IO;
using Newtonsoft.Json;
using StatoBot.Analytics;

namespace StatoBot.Reports
{
	public static class ReportGenerator
	{
		public static Report ForFile(string path, BotInfo botInfo)
		{
			var content = File.ReadAllText(path);
			var json = JsonConvert.DeserializeObject<SaveFilePayload>(content);
			var statistics = new ReportInput(json.Words, json.Users, json.Letters, botInfo);

			return new Report(statistics);
		}

		public static Report ForAnalyzingBot(AnalyzerBot bot)
		{
			return new Report(
				new ReportInput(
					bot.Analyzer.WordStatistics,
					bot.Analyzer.UserStatistics,
					bot.Analyzer.LetterStatistics,
					BotInfo.FromBot(bot)
				)
			);
		}

		public static Report ForAnalyzer(ChatAnalyzer analyzer, BotInfo botInfo)
		{
			return ReportGenerator.ForData(
				new ReportInput(analyzer.WordStatistics, analyzer.UserStatistics, analyzer.LetterStatistics, botInfo)
			);
		}

		public static Report ForData(ReportInput input)
		{
			return new Report(input);
		}
	}
}
