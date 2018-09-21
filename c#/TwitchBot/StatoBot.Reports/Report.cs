using System;
using System.Collections.Generic;
using System.Linq;
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

		public decimal TotalWords;
		public decimal TotalUsers;
		public decimal TotalLetters;

		public float AverageWordLength;

		public TimeSpan StreamLength;
	}

	public class Report
	{
		public ReportInput Input { get; }
		public ReportStatistics Statistics { get; }

		public Report(ReportInput input)
		{
			Input = input;
			Statistics = new ReportStatistics();

			Generate();
		}

		public string FormatWith<T>()
			where T : ReportFormatter, new()
		{
			return new T().Format(this);
		}

		private void Generate()
		{
			var users = Input.Statistics.Users.ToList();
			var letters = Input.Statistics.Letters.ToList();
			var words = Input.Statistics.Words.ToList();

			// Tops
			Statistics.UsersSortedByMessagesSent = SortDescending(users);
			Statistics.LettersSortedByUsage = SortDescending(letters);
			Statistics.WordsSortedByUsage = SortDescending(words);

			// Totals
			Statistics.TotalUsers = Total(users);
			Statistics.TotalLetters = Total(letters);
			Statistics.TotalWords = Total(words);

			// Misc
			Statistics.AverageWordLength = (float)(Statistics.TotalWords / Statistics.TotalLetters);
			Statistics.StreamLength = Input.BotInfo.EndTime - Input.BotInfo.StartTime;
		}

		private static decimal Total(IEnumerable<Entry> collection)
		{
			return collection.Aggregate((decimal)0, (acc, item) => acc += item.Value);
		}

		private static OrderedEntry SortDescending(IEnumerable<Entry> collection)
		{
			return from entry in collection orderby entry.Value descending select entry;
		}
	}
}
