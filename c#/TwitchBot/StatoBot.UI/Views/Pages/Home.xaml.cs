using System.Windows.Controls;
using StatoBot.UI.Helpers;

namespace StatoBot.UI.Views.Pages
{
	public partial class Home : UserControl
	{
		public Home()
		{
			InitializeComponent();
		}

		private void StartButton_Click(object sender, System.Windows.RoutedEventArgs e)
		{
			WindowManager.SwitchTo(new Statistics(ChannelNameInput.Text));
		}
	}
}
