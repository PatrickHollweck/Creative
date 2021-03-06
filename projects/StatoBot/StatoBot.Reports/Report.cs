using System;
using System.Linq;
using System.Collections.Generic;
using System.Numerics;

using StatoBot.Reports.Formatters;

using Entry = System.Collections.Generic.KeyValuePair<string, decimal>;
using OrderedEntry = System.Linq.IOrderedEnumerable<System.Collections.Generic.KeyValuePair<string, decimal>>;

namespace StatoBot.Reports
{
    public class ReportStatistics
    {
        public OrderedEntry UsersSortedByMessagesSent;
        public OrderedEntry LettersSortedByUsage;
        public OrderedEntry WordsSortedByUsage;

        public BigInteger TotalWords;
        public BigInteger TotalUsers;
        public BigInteger TotalLetters;

        public float AverageWordLength;

        public TimeSpan StreamLength;
    }

    public class Report
    {
        public ReportData Input { get; }
        public ReportStatistics Statistics { get; }

        public Report(ReportData input)
        {
            Input = input;
            Statistics = new ReportStatistics();

            Generate();
        }

        public string FormatWith<T>()
            where T : IReportFormatter, new()
        {
            return new T().Format(this);
        }

        public string FormatWith(IReportFormatter formatter)
        {
            return formatter.Format(this);
        }

        private void Generate()
        {
            var users = Input.Statistics.Users.ToArray();
            var letters = Input.Statistics.Letters.ToArray();
            var words = Input.Statistics.Words.ToArray();

            // Tops
            Statistics.UsersSortedByMessagesSent = SortDescending(users);
            Statistics.LettersSortedByUsage = SortDescending(letters);
            Statistics.WordsSortedByUsage = SortDescending(words);

            // Totals
            Statistics.TotalUsers = Total(users);
            Statistics.TotalLetters = Total(letters);
            Statistics.TotalWords = Total(words);

            Statistics.StreamLength = Input.BotInfo.EndTime - Input.BotInfo.StartTime;
        }

        private static BigInteger Total(IEnumerable<Entry> collection)
        {
            return collection.Aggregate((BigInteger)0, (acc, item) => acc + (BigInteger)item.Value);
        }

        private static OrderedEntry SortDescending(IEnumerable<Entry> collection)
        {
            return from entry in collection orderby entry.Value descending select entry;
        }
    }
}
