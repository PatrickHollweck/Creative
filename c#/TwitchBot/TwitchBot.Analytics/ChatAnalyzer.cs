using System;
using System.Threading.Tasks;

using StatoBot.Core;

namespace StatoBot.Analytics
{
	public class ChatAnalyzer
	{
		public Statistics WordStatistics { get; }
		public Statistics LetterStatistics { get;}
		public Statistics UserStatistics { get; }

		public ChatAnalyzer()
		{
			WordStatistics = new Statistics();
			LetterStatistics = new Statistics();
			UserStatistics = new Statistics();
		}

		public Action<OnMessageReceivedEventArgs> AsHook()
		{
			return async (e) => await AnalyzeAsync(e);
		}

		public void Analyze(OnMessageReceivedEventArgs e)
		{
			if(e.IsSystemMessage)
			{
				return;
			}

			UserStatistics.Increment(e.Author);

			var words = e.Content.Split(' ');
			foreach(var word in words)
			{
				WordStatistics.Increment(word);

				foreach(var character in word)
				{
					LetterStatistics.Increment(character.ToString().ToLower());
				}
			}
		}

		public async Task AnalyzeAsync(OnMessageReceivedEventArgs e)
		{
			await Task.Run(() => Analyze(e));
		}
	}
}
