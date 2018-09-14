using System;

namespace TwitchBot.Reports
{
	public class BotInfo
	{
		public DateTime StartTime;
		public DateTime EndTime;

		public string ChannelName;

		public BotInfo(DateTime startTime, DateTime endTime, string channelName)
		{
			StartTime = startTime;
			EndTime = endTime;
			ChannelName = channelName;
		}

		public static BotInfo FromBot(Core.TwitchBot bot)
		{
			return new BotInfo(bot.StartTime, bot.EndTime, bot.Channel);
		}
	}
}