using System.Windows.Navigation;
using StatoBot.UI.DependencyInjection;
using StatoBot.UI.Helpers;
using StatoBot.UI.Views.Pages;

namespace StatoBot.UI.Views.Windows
{
	public partial class MainWindow : NavigationWindow
	{
		public MainWindow()
		{
			InitializeComponent();
			Kernel.Instance.Bind<MainWindow>().ToConstant(this);

			WindowManager.SwitchTo(new Home());
		}
	}
}
