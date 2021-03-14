using System;

namespace StatoBot.Analytics
{
	public class OnStatisticsChangedEventArgs : EventArgs
	{
		public OnStatisticsChangedEventArgs(ChatStatistics statistics)
		{
			Statistics = statistics;
		}

		public ChatStatistics Statistics;
	}
}
