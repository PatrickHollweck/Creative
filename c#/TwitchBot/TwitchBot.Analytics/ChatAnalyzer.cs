using System;
using System.Text;
using System.Threading.Tasks;
using TwitchBot.Core;

using StatsCollection = System.Collections.Generic.Dictionary<string, decimal>;

namespace TwitchBot.Analytics
{
	public class ChatAnalyzer
	{
		private readonly StatsCollection wordStatistics;
		private readonly StatsCollection letterStatistics;
		private readonly StatsCollection userStatistics;

		private readonly Encoding encoder;

		public ChatAnalyzer()
		{
			this.wordStatistics = new StatsCollection();
			this.letterStatistics = new StatsCollection();
			this.userStatistics = new StatsCollection();

			this.encoder = Encoding.GetEncoding(
				"UTF-8",
				new EncoderReplacementFallback(string.Empty),
				new DecoderExceptionFallback()
			);


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

			this.Increment(this.userStatistics, e.Author);

			var words = e.Content.Split(' ');
			foreach(var word in words)
			{
				this.Increment(this.wordStatistics, word);

				foreach(var character in word)
				{
					this.Increment(this.letterStatistics, character.ToString());
				}
			}
		}

		public async Task AnalyzeAsync(OnMessageReceivedEventArgs e)
		{
			await Task.Run(() => this.Analyze(e));
		}

		public StatsCollection GetWords()
		{
			return this.wordStatistics;
		}

		public StatsCollection GetLetters()
		{
			return this.letterStatistics;
		}

		public StatsCollection GetUsers()
		{
			return this.userStatistics;
		}

		private void Increment(StatsCollection collection, string key)
		{
			key = this.SanitizeKey(key);

			if(!collection.ContainsKey(key))
			{
				collection.Add(key, 1);
			}
			else
			{
				collection.TryGetValue(key, out var count);
				collection.Remove(key);
				collection.Add(key, count + 1);
			}
		}

		private string SanitizeKey(string key)
		{
			return encoder.GetString(encoder.GetBytes(key));
		}
	}
}
