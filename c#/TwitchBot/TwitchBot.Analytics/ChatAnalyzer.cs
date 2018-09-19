using System;
using System.Threading.Tasks;

using StatoBot.Core;

namespace StatoBot.Analytics
{
	public class ChatAnalyzer
	{
		public readonly ChatStatistics Statistics;

		public ChatAnalyzer()
		{
			Statistics = new ChatStatistics();
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

			Statistics.Users.Increment(e.Author);

			var words = e.Content.Split(' ');
			foreach(var word in words)
			{
				Statistics.Words.Increment(word);

				foreach(var character in word)
				{
					Statistics.Letters.Increment(character.ToString().ToLower());
				}
			}
		}

		public async Task AnalyzeAsync(OnMessageReceivedEventArgs e)
		{
			await Task.Run(() => Analyze(e));
		}
	}
}
