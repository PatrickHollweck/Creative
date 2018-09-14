using System;
using System.Threading.Tasks;
using TwitchBot.Core;

namespace TwitchBot.Analytics
{
	public class ChatAnalyzer
	{
		private readonly StatisticsCollection wordStatistics;
		private readonly StatisticsCollection letterStatistics;
		private readonly StatisticsCollection userStatistics;

		public ChatAnalyzer()
		{
			this.wordStatistics = new StatisticsCollection();
			this.letterStatistics = new StatisticsCollection();
			this.userStatistics = new StatisticsCollection();
		}

		public Func<OnMessageReceivedEventArgs, Task> AsHook()
		{
			return this.AnalyzeAsync;
		}

		public void Analyze(OnMessageReceivedEventArgs e)
		{
			if(e.IsSystemMessage)
			{
				return;
			}

			this.userStatistics.Increment(e.Author);

			var words = e.Content.Split(' ');
			foreach(var word in words)
			{
				this.wordStatistics.Increment(word);

				foreach(var character in word)
				{
					this.letterStatistics.Increment(character.ToString().ToLower());
				}
			}
		}

		public async Task AnalyzeAsync(OnMessageReceivedEventArgs e)
		{
			await Task.Run(() => this.Analyze(e));
		}

		public StatisticsCollection GetWords()
		{
			return this.wordStatistics;
		}

		public StatisticsCollection GetLetters()
		{
			return this.letterStatistics;
		}

		public StatisticsCollection GetUsers()
		{
			return this.userStatistics;
		}
	}
}
