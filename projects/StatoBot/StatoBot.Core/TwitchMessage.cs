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

        public bool IsChatMessage => Type == TwitchMessageType.Chat;
        public bool IsSystemMessage => Type == TwitchMessageType.System;

        public TwitchMessage(string rawMessage, string author, string content, TwitchMessageType type)
        {
            RawMessage = rawMessage;

            Type = type;
            Author = author;
            Content = content;
        }
    }
}