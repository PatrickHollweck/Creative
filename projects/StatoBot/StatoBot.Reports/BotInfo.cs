using System;

using StatoBot.Core;

namespace StatoBot.Reports
{
    public class BotInfo
    {
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }

        public string Channel { get; set; }

        public BotInfo(DateTime startTime, DateTime endTime, string channel)
        {
            StartTime = startTime;
            EndTime = endTime;
            Channel = channel;
        }

        public static BotInfo FromBot(TwitchBot bot)
        {
            return new BotInfo(bot.StartTime, DateTime.Now, bot.Channel);
        }
    }
}