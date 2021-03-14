using System.Text;
using System.Collections.Concurrent;

namespace StatoBot.Analytics
{
    public class CountStatistics : ConcurrentDictionary<string, decimal>
    {
        private static readonly Encoding encoder = Encoding.Unicode;

        public void Increment(string key)
        {
			AddOrUpdate(SanitizeKey(key), 1, (_, oldValue) => oldValue + 1);
        }

        private string SanitizeKey(string key)
        {
            return encoder.GetString(encoder.GetBytes(key));
        }
    }
}
