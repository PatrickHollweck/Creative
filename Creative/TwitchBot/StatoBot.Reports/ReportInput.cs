using StatoBot.Analytics;

namespace StatoBot.Reports
{
	public class ReportInput
	{
		public ChatStatistics Statistics;
		public BotInfo BotInfo { get; set; }

		public ReportInput(
			ChatStatistics statistics,
			BotInfo botInfo
		)
		{
			Statistics = statistics;
			BotInfo = botInfo;
		}
	}
}