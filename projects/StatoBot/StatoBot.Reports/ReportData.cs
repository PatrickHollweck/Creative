using StatoBot.Analytics;

namespace StatoBot.Reports
{
	public class ReportData
	{
		public ChatStatistics Statistics;
		public BotInfo BotInfo { get; set; }

		public ReportData(
			ChatStatistics statistics,
			BotInfo botInfo
		)
		{
			Statistics = statistics;
			BotInfo = botInfo;
		}
	}
}