using System;
using System.Diagnostics;
using System.Threading.Tasks;
using System.Windows.Controls;

using StatoBot.Analytics;
using StatoBot.Core;
using StatoBot.Reports;

namespace StatoBot.UI.Views.Pages
{
	public partial class Statistics : Page
	{
		private readonly AnalyzerBot bot;
		private readonly Timeout timeout;

		public Statistics(string channelName)
		{
			InitializeComponent();

			NameDisplay.Content = channelName;

			var credentials = Credentials.FromFile("./twitch_credentials.json");

			bot = new AnalyzerBot(credentials, channelName);
			bot.Analyzer.OnStatisticsChanged += (e) => UpdateDisplay(e.Statistics);

			timeout = new Timeout(TimeSpan.FromSeconds(-2));

			Task.Run(bot.SetupAndListenAsync);
		}

		public void UpdateDisplay(ChatStatistics statistics)
		{
			if (!timeout.IsOver())
			{
				return;
			}

			Dispatcher.InvokeAsync(() =>
			{
				var report = new Report(new ReportInput(bot.Analyzer.Statistics, BotInfo.FromBot(bot)));

				WordsStatisticsGrid.ItemsSource = report.Statistics.WordsSortedByUsage;
				LetterStatisticsGrid.ItemsSource = report.Statistics.LettersSortedByUsage;
				UserStatisticsGrid.ItemsSource = report.Statistics.UsersSortedByMessagesSent;
			});
		}
	}
}
