using System.Windows;
using StatoBot.UI.DependencyInjection;
using StatoBot.UI.Helpers;
using StatoBot.UI.Views.Pages;

namespace StatoBot.UI.Views.Windows
{
	public partial class MainWindow : Window
	{
		public MainWindow()
		{
			InitializeComponent();
			Kernel.Instance.Bind<MainWindow>().ToConstant(this);

			WindowManager.SwitchTo(new Home());
		}
	}
}
