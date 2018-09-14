using System;
using System.Timers;

namespace TwitchBot.Analytics
{
	public class AnalyzerBot : TwitchBot
	{
		public ChatAnalyzer Analyzer;

		private StatisticsSaver saver;
		private Timer timer;

		public AnalyzerBot(string nickname, string password, string channel) : base(nickname, password, channel)
		{
			this.Analyzer = new ChatAnalyzer();
			this.OnMessageReceived += this.Analyzer.AsHook();
		}

		public void EnableStatsAutosaving()
		{
			this.EnableStatsAutosaving($"./{this.Channel}_stats.json");
		}

		public void EnableStatsAutosaving(string path)
		{
			this.saver = new StatisticsSaver(path, this.Analyzer);

			if(this.timer != null)
			{
				this.timer.Stop();
			}

			this.timer = this.saver.AsTimer(60 * 1000);
			this.timer.Start();
		}

		public void DisableStatsAutosaving()
		{
			this.timer.Stop();
		}
	}
}
