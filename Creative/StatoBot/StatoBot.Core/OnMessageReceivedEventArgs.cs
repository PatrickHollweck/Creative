using System;
using System.Text.RegularExpressions;

namespace StatoBot.Core
{
    public class OnMessageReceivedEventArgs : EventArgs
    {
        public string Author { get; }
        public string Content { get; }

        public string RawMessage { get; }

        public bool IsChatMessage { get; }
        public bool IsSystemMessage { get; }

        public TwitchBot Bot { get; }

        public OnMessageReceivedEventArgs(string rawMessage, TwitchBot bot)
        {
            // TODO: Parsing is not really the responsibility of this class.

            Bot = bot;
            RawMessage = rawMessage;

            Author = new Regex("@(.*).tmi.twitch.tv", RegexOptions.Compiled)
                .Match(RawMessage).Groups[1].Value;

            Content = new Regex($"PRIVMSG #{Bot.Channel} :(.*)$", RegexOptions.Compiled)
                .Match(RawMessage).Groups[1].Value;

            Author = string.IsNullOrWhiteSpace(Author) ? null : Author;
            Content = string.IsNullOrWhiteSpace(Content) ? null : Content;

            IsChatMessage = Content != null;
            IsSystemMessage = !IsChatMessage;
        }
    }
}
