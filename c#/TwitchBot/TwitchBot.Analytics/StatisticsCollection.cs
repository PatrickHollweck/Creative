using System.Text;
using System.Collections.Generic;

namespace TwitchBot.Analytics
{
	public class StatisticsCollection : Dictionary<string, decimal>
	{
		private Encoding encoder;

		public StatisticsCollection()
		{
			this.encoder = Encoding.GetEncoding(
				"UTF-8",
				new EncoderReplacementFallback(string.Empty),
				new DecoderExceptionFallback()
			);

		}

		public void Increment(string key)
		{
			key = this.SanitizeKey(key);

			if(!this.ContainsKey(key))
			{
				this.Add(key, 1);
			}
			else
			{
				this.TryGetValue(key, out var count);
				this.Remove(key);
				this.Add(key, count + 1);
			}
		}

		private string SanitizeKey(string key)
		{
			return encoder.GetString(encoder.GetBytes(key));
		}
	}
}
