using System.Threading.Tasks;

namespace StatoBot.Core
{
    public enum TwitchMessageType
    {
        System,
        Chat,
    }

    public class TwitchMessage
    {
        public readonly string Author;
        public readonly string Content;

        public readonly string RawMessage;

        public readonly TwitchMessageType Type;
        public readonly bool IsChatMessage;
        public readonly bool IsSystemMessage;

        public TwitchMessage(string rawMessage, string author, string content, TwitchMessageType type)
        {
            RawMessage = rawMessage;

            Author = author;
            Content = content;

            Type = type;
            if (type == TwitchMessageType.Chat)
            {
                IsChatMessage = true;
                IsSystemMessage = false;
            }
            else
            {
                IsChatMessage = false;
                IsSystemMessage = true;
            }
        }

        public static TwitchMessage FromRawMessage(string rawMessage, string channelName)
        {
            return TwitchMessageParser.Parse(rawMessage, channelName);
        }

        public static async Task<TwitchMessage> FromRawMessageAsync(string rawMessage, string channelName)
        {
            return await Task.Run(() => TwitchMessageParser.Parse(rawMessage, channelName));
        }
    }
}