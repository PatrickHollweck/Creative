using System;

using StatoBot.Core;

namespace StatoBot.Analytics
{
    public class ChatAnalyzer
    {
        public readonly ChatStatistics Statistics;
        public event Action<OnStatisticsChangedEventArgs> OnStatisticsChanged;

        public ChatAnalyzer()
        {
            Statistics = new ChatStatistics();
        }

        public void Analyze(TwitchMessage message)
        {
            if (message.IsSystemMessage)
            {
                return;
            }

            Statistics.Users.Increment(message.Author);

            foreach (var word in message.Content.Split(' '))
            {
                Statistics.Words.Increment(word);

                foreach (var character in word)
                {
                    Statistics.Letters.Increment(character.ToString().ToLower());
                }
            }

            OnStatisticsChanged?.Invoke(new OnStatisticsChangedEventArgs(Statistics));
        }
    }
}
