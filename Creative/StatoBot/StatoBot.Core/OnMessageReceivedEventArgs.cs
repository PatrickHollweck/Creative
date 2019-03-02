using System;

namespace StatoBot.Core
{
    public class OnMessageReceivedEventArgs : EventArgs
    {
        public readonly TwitchMessage Message;
        public readonly TwitchBot Bot;

        public OnMessageReceivedEventArgs(TwitchMessage message, TwitchBot bot)
        {
            Message = message;
            Bot = bot;
        }

        public static OnMessageReceivedEventArgs FromRawMessage(string rawMessage, TwitchBot bot)
        {
            return new OnMessageReceivedEventArgs(TwitchMessageParser.Parse(rawMessage, bot.Channel), bot);
        }
    }
}
