using System;
using System.Threading.Tasks;

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

        public void Analyze(OnMessageReceivedEventArgs e)
        {
            if (e.Message.IsSystemMessage)
            {
                return;
            }

            Statistics.Users.Increment(e.Message.Author);

            var words = e.Message.Content.Split(' ');
            foreach (var word in words)
            {
                Statistics.Words.Increment(word);

                foreach (var character in word)
                {
                    Statistics.Letters.Increment(character.ToString().ToLower());
                }
            }

            OnStatisticsChanged?.Invoke(new OnStatisticsChangedEventArgs(Statistics));
        }

        public async Task AnalyzeAsync(OnMessageReceivedEventArgs e)
        {
            await Task.Run(() => Analyze(e));
        }
    }
}
