using StatoBot.Analytics;

namespace StatoBot.Reports
{
	public class ReportInput
	{
		public Statistics WordStatistics { get; }
		public Statistics UserStatistics { get; }
		public Statistics LetterStatistics { get; }

		public BotInfo BotInfo { get; set; }

		public ReportInput(
			Statistics wordStatistics,
			Statistics userStatistics,
			Statistics letterStatistics,
			BotInfo botInfo
		)
		{
			WordStatistics = wordStatistics;
			UserStatistics = userStatistics;
			LetterStatistics = letterStatistics;
			BotInfo = botInfo;
		}
	}
}