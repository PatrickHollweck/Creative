using System;
using System.Timers;
using TwitchBot.Core;

namespace TwitchBot.Analytics
{
    public class AnalyzerBot : Core.TwitchBot
    {
        public ChatAnalyzer Analyzer;

        private StatisticsSaver saver;
        private Timer timer;

        public event Action OnSave;

        public AnalyzerBot(Credentials credentials, string channel) : base(credentials, channel)
        {
            this.Analyzer = new ChatAnalyzer();
            this.OnMessageReceived += this.Analyzer.AsHook();
        }

        public void EnableStatsAutosaving()
        {
            this.EnableStatsAutosaving($"./statistics/{this.Channel}_stats.json");
        }

        public void EnableStatsAutosaving(string path)
        {
            this.saver = new StatisticsSaver(path, this.Analyzer);
            this.saver.OnSave += () => this.OnSave?.Invoke();

            timer?.Stop();

            this.timer = this.saver.AsTimer(60 * 1000);
            this.timer.Start();
        }

        public void DisableStatsAutosaving()
        {
            this.timer.Stop();
        }
    }
}
