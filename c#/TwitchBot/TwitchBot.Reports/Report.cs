using System.Collections.Generic;
using System.Linq;
using TwitchBot.Reports.Formatters;

using Entry = System.Collections.Generic.KeyValuePair<string, decimal>;
using OrderedEntry = System.Linq.IOrderedEnumerable<System.Collections.Generic.KeyValuePair<string, decimal>>;

namespace TwitchBot.Reports
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
	}

	public class Report
	{
		public readonly ReportInput Input;
		public readonly ReportStatistics Statistics;

		public Report(ReportInput input)
		{
			this.Input = input;
			this.Statistics = new ReportStatistics();

			this.Generate();
		}

		public string FormatWith<T>()
			where T : ReportFormatter, new()
		{
			return new T().Format(this);
		}

		private void Generate()
		{
			var users = this.Input.UserStatistics.ToList();
			var letters = this.Input.LetterStatistics.ToList();
			var words = this.Input.WordStatistics.ToList();

			this.Statistics.UsersSortedByMessagesSent = SortDescending(users);
			this.Statistics.LettersSortedByUsage = SortDescending(letters);
			this.Statistics.WordsSortedByUsage = SortDescending(words);

			this.Statistics.TotalUsers = Total(users);
			this.Statistics.TotalLetters = Total(letters);
			this.Statistics.TotalWords = Total(words);

			this.Statistics.AverageWordLength = (float)(this.Statistics.TotalWords / this.Statistics.TotalLetters);
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
