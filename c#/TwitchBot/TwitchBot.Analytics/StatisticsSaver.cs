using System;
using System.Diagnostics;
using System.IO;
using System.Timers;
using Newtonsoft.Json;

namespace TwitchBot.Analytics
{
	public class StatisticsSaver
	{
		private ChatAnalyzer analyzer;
		private string filePath;

		private bool isFirstSave;

		public StatisticsSaver(string filePath, ChatAnalyzer analyzer)
		{
			this.filePath = filePath;
			this.analyzer = analyzer;
		}

		public void Save()
		{
			try
			{
				File.WriteAllText(this.filePath,JsonConvert.SerializeObject(new {
					words = this.analyzer.GetWords(),
					letters = this.analyzer.GetLetters(),
					users = this.analyzer.GetUsers()
				}, Formatting.Indented));
			}
			catch(Exception e)
			{
				Debug.WriteLine("Could not save statistics - \n" + e);
			}
		}

		public Timer AsTimer(int interval)
		{
			var timer = new Timer(interval);
			timer.Elapsed += (sender, e) => this.Save();

			return timer;
		}

		public void MergeExistingFile()
		{
			if (File.Exists(this.filePath))
			{
				var lastWrite = File.GetLastWriteTime(this.filePath);
				if(lastWrite > DateTime.Now)
				{
					return;
				}

				// this.analyzer.Merge();
			}
		}
	}
}
