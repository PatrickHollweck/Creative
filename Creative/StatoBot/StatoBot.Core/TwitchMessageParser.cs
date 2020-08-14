using System.Text.RegularExpressions;

namespace StatoBot.Core
{
    public class TwitchMessageParser
    {
		protected readonly Regex AuthorRegex; 
		protected readonly Regex ContentRegex;

		public TwitchMessageParser(string channelName)
		{
			AuthorRegex = new Regex("@(.*).tmi.twitch.tv", RegexOptions.Compiled);
			ContentRegex = new Regex($"PRIVMSG #{channelName} :(.*)$", RegexOptions.Compiled);
		}

        public TwitchMessage Parse(string rawMessage)
        {
            var author = AuthorRegex.Match(rawMessage).Groups[1].Value;
            var content = ContentRegex.Match(rawMessage).Groups[1].Value;

            author = string.IsNullOrWhiteSpace(author) ? null : author;
            content = string.IsNullOrWhiteSpace(content) ? null : content;

            var type = content != null ? TwitchMessageType.Chat : TwitchMessageType.System;

            return new TwitchMessage(
                rawMessage,
                author,
                content,
                type
            );
        }
    }
}