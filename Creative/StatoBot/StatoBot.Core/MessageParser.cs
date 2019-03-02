using System.Threading.Tasks;
using System.Text.RegularExpressions;

namespace StatoBot.Core
{
    public static class TwitchMessageParser
    {
        public static TwitchMessage Parse(string rawMessage, string channelName)
        {
            var author = new Regex("@(.*).tmi.twitch.tv", RegexOptions.Compiled)
                .Match(rawMessage).Groups[1].Value;

            // TODO: Do we need the channel name here ? We could just "*" it?!
            var content = new Regex($"PRIVMSG #{channelName} :(.*)$", RegexOptions.Compiled)
                .Match(rawMessage).Groups[1].Value;

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