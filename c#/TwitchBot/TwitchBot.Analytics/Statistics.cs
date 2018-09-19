using System;
using System.Collections.Generic;
using System.Text;

namespace StatoBot.Analytics
{
	public class Statistics : Dictionary<string, decimal>
	{
		private readonly Encoding encoder;
		private readonly object mutationLock;

		public Statistics()
		{
			encoder = Encoding.GetEncoding(
				"UTF-8",
				new EncoderReplacementFallback(string.Empty),
				new DecoderExceptionFallback()
			);

			mutationLock = new object();

		}

		public void Increment(string key)
		{
			key = SanitizeKey(key);

			lock (mutationLock)
			{
				if(!ContainsKey(key))
				{
					Add(key, 1);
				}
				else
				{
					TryGetValue(key, out var count);
					Remove(key);
					Add(key, count + 1);
				}
			}
		}

		private string SanitizeKey(string key)
		{
			return encoder.GetString(encoder.GetBytes(key));
		}
	}
}
