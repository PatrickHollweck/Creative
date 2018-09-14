using System.IO;
using Newtonsoft.Json;
using TwitchBot.Analytics;

namespace TwitchBot.Reports
{
	public class ReportGenerator
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
					bot.Analyzer.GetWords(),
					bot.Analyzer.GetUsers(),
					bot.Analyzer.GetLetters(),
					BotInfo.FromBot(bot)
				)
			);
		}

		public static Report ForAnalyzer(ChatAnalyzer analyzer, BotInfo botInfo)
		{
			return ReportGenerator.ForData(
				new ReportInput(analyzer.GetWords(), analyzer.GetUsers(), analyzer.GetLetters(), botInfo)
			);
		}

		public static Report ForData(ReportInput input)
		{
			return new Report(input);
		}
	}
}
