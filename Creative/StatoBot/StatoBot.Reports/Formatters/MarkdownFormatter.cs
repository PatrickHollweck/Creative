using System.Collections.Generic;
using System.Linq;

namespace StatoBot.Reports.Formatters
{
	public class MarkdownFormatter : IReportFormatter
	{
		public string FileExtension => ".md";

		public string Format(Report report)
		{
			return
$@"
# Chat statistics report for channel '{report.Input.BotInfo.Channel}'
#### Statistics from {report.Input.BotInfo.StartTime} until {report.Input.BotInfo.EndTime}

---

## Overview

#### Total Statistics collection time
{report.Statistics.StreamLength}

#### Total Words used
{report.Statistics.TotalWords}

#### Total Letters used
{report.Statistics.TotalLetters}

#### Total unique Chatters
{report.Statistics.TotalUsers}

---

## Top 20 Users with most messages
{AsMarkdownList(report.Statistics.UsersSortedByMessagesSent.Take(20))}

## Top 50 Words used
{AsMarkdownList(report.Statistics.WordsSortedByUsage.Take(50))}

## Top 50 Letters used
{AsMarkdownList(report.Statistics.LettersSortedByUsage.Take(50))}
";
		}

		private static string AsMarkdownList(IEnumerable<KeyValuePair<string, decimal>> input)
		{
			return input.Aggregate("", (current, entry) => current + $"- {entry.Key} : {entry.Value} \n");
		}
	}
}
