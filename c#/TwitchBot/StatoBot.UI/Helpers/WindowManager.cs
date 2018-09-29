using System.Windows.Controls;
using StatoBot.UI.DependencyInjection;

using Ninject;
using StatoBot.UI.Views.Windows;

namespace StatoBot.UI.Helpers
{
	internal class WindowManager
	{
		public static void SwitchTo(Page page)
		{
			Kernel.Instance.Get<MainWindow>().Navigate(page);
		}
	}
}
