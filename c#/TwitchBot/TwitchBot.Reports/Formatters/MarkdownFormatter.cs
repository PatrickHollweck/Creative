using System;
using System.Collections.Generic;
using System.Linq;

namespace TwitchBot.Reports.Formatters
{
	public class MarkdownFormatter : ReportFormatter
	{

		public string Format(Report report)
		{
			return
$@"
# Chat statistics report for: '{report.Input.BotInfo.ChannelName}'
#### Statistics from {report.Input.BotInfo.StartTime} until {report.Input.BotInfo.EndTime}

---

## Total Words used
{report.Statistics.TotalWords}

## Total Letters used
{report.Statistics.TotalLetters}

## Total unique Chatters
{report.Statistics.TotalUsers}

---

## Top 20 Users with most messages
{this.AsMarkdownList(report.Statistics.UsersSortedByMessagesSent.Take(20))}

## Top 50 Words used
{this.AsMarkdownList(report.Statistics.WordsSortedByUsage.Take(50))}

## Top 50 Letters used
{this.AsMarkdownList(report.Statistics.LettersSortedByUsage.Take(50))}
";
		}

		private string AsMarkdownList(IEnumerable<KeyValuePair<string, decimal>> input)
		{
			return input.Aggregate("", (current, entry) => current + $"- {entry.Key} : {entry.Value} \n");
		}
	}
}
