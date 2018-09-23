using System;
using System.Threading.Tasks;
using System.Windows.Controls;

using StatoBot.Analytics;
using StatoBot.Core;
using StatoBot.Reports;

namespace StatoBot.UI.Views.Pages
{
	public partial class Statistics : UserControl
	{
		private AnalyzerBot bot;
		private DateTime lastUpdate;

		public Statistics(string channelName)
		{
			InitializeComponent();

			NameDisplay.Content = channelName;

			var credentials = Credentials.FromFile("./twitch_credentials.json");

			bot = new AnalyzerBot(credentials, channelName);
			bot.Analyzer.OnStatisticsChanged += (e) => UpdateDisplay(e.Statistics);

			Task.Run(bot.SetupAndListenAsync);
		}

		public void UpdateDisplay(ChatStatistics statistics)
		{
			if (lastUpdate.Subtract(TimeSpan.FromSeconds(-2)) > DateTime.Now)
			{
				return;
			}

			lastUpdate = DateTime.Now;

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
