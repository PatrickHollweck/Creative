using System;
using System.Collections.Generic;
using System.Text;
using StatsCollection = System.Collections.Generic.Dictionary<string, decimal>;

namespace TwitchBot.Analytics
{
	public class ChatAnalyzer
	{
		private StatsCollection words;
		private StatsCollection letters;
		private StatsCollection users;

		private Encoding encoder;

		public ChatAnalyzer()
		{
			this.words = new StatsCollection();
			this.letters = new StatsCollection();
			this.users = new StatsCollection();

			this.encoder = Encoding.GetEncoding(
				"UTF-8",
				new EncoderReplacementFallback(string.Empty),
				new DecoderExceptionFallback()
			);


		}

		public Action<OnMessageReceivedEventArgs> AsHook()
		{
			return new Action<OnMessageReceivedEventArgs>(e => 
			{
				this.Analyze(e);
			});
		}

		public void Analyze(OnMessageReceivedEventArgs e)
		{
			if(e.IsSystemMessage)
			{
				return;
			}

			this.Increment(this.users, e.Username);

			var words = e.Content.Split(' ');
			foreach(var word in words)
			{
				this.Increment(this.words, word);

				foreach(var character in word)
				{
					this.Increment(this.letters, character.ToString());
				}
			}
		}

		public StatsCollection GetWords()
		{
			return this.words;
		}

		public StatsCollection GetLetters()
		{
			return this.letters;
		}

		public StatsCollection GetUsers()
		{
			return this.users;
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
				collection.TryGetValue(key, out decimal count);
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
