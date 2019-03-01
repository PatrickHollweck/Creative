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
            // TODO: Replace `DateTime.Now`'s with actual timings
            return new BotInfo(DateTime.Now, DateTime.Now, bot.Channel);
        }
    }
}