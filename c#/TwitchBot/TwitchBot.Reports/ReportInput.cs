using TwitchBot.Analytics;

namespace TwitchBot.Reports
{
	public class ReportInput
	{
		public StatisticsCollection WordStatistics;
		public StatisticsCollection UserStatistics;
		public StatisticsCollection LetterStatistics;

		public BotInfo BotInfo;

		public ReportInput(
			StatisticsCollection wordStatistics,
			StatisticsCollection userStatistics,
			StatisticsCollection letterStatistics,
			BotInfo botInfo
		)
		{
			this.WordStatistics = wordStatistics;
			this.UserStatistics = userStatistics;
			this.LetterStatistics = letterStatistics;
			this.BotInfo = botInfo;
		}
	}
}