using System;
using System.Timers;
using StatoBot.Core;

namespace StatoBot.Analytics
{
    public class AnalyzerBot : Core.TwitchBot
    {
        public ChatAnalyzer Analyzer;

        private StatisticsSaver saver;
        private Timer timer;

        public event Action OnSave;

        public AnalyzerBot(Credentials credentials, string channel) : base(credentials, channel)
        {
            Analyzer = new ChatAnalyzer();
            OnMessageReceived += Analyzer.AsHook();
        }

        public void EnableStatsAutosaving()
        {
            EnableStatsAutosaving($"./statistics/{Channel}_stats.json");
        }

        public void EnableStatsAutosaving(string path)
        {
            saver = new StatisticsSaver(path, Analyzer);
            saver.OnSave += () => OnSave?.Invoke();

            timer?.Stop();

            timer = saver.AsTimer(60 * 1000);
            timer.Start();
        }

        public void DisableStatsAutosaving()
        {
            timer.Stop();
        }
    }
}
