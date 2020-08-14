using System;
using System.IO;
using System.Linq;
using System.Diagnostics;
using System.Collections.Generic;

using StatoBot.Core;
using StatoBot.Analytics;
using StatoBot.Reports.Formatters;

namespace StatoBot.Reports
{
	public class ReportWriter
	{
		protected readonly string BasePath;
		protected readonly ChatAnalyzer Analyzer;
		protected readonly List<IReportFormatter> Formatters;

		public ReportWriter(string basePath, ChatAnalyzer analyzer, IEnumerable<IReportFormatter> formatters)
		{
			BasePath = basePath;
			Analyzer = analyzer;
			Formatters = formatters.ToList();
		}

		public void Save(TwitchBot bot)
		{
			try
			{
				var report = new Report(
					new ReportData(Analyzer.Statistics, BotInfo.FromBot(bot))
				);

				var startTime = report.Input.BotInfo.StartTime.ToString("dd.MM.yyyy#HHmmss");

				foreach (var formatter in Formatters)
				{
					var targetDirectory = Path.Combine(BasePath, startTime);
					var fileName = $"statistics.{formatter.FileExtension}";

					Directory.CreateDirectory(targetDirectory);

					File.WriteAllText(
						Path.Combine(targetDirectory, fileName),
						report.FormatWith(formatter)
					);
				}
			}
			catch(Exception e)
			{
				Debug.WriteLine("Could not save statistics - \n" + e);
			}
		}
	}
}
