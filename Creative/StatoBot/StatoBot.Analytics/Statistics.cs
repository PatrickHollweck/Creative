using System;
using System.Text;
using System.Collections.Concurrent;

namespace StatoBot.Analytics
{
    public class Statistics : ConcurrentDictionary<string, decimal>
    {
        private readonly Encoding encoder;

        public Statistics()
        {
            encoder = Encoding.GetEncoding(
                "UTF-8",
                new EncoderReplacementFallback(string.Empty),
                new DecoderExceptionFallback()
            );
        }

        public void Increment(string key)
        {
            key = SanitizeKey(key);

            if (!ContainsKey(key))
            {
                TryAdd(key, 1);
            }
            else
            {
                TryGetValue(key, out var count);
                TryRemove(key, out decimal _);
                TryAdd(key, count + 1);
            }
        }

        private string SanitizeKey(string key)
        {
            return encoder.GetString(encoder.GetBytes(key));
        }
    }
}
