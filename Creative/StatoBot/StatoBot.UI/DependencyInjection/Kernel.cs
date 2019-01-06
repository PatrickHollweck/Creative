using Ninject;

namespace StatoBot.UI.DependencyInjection
{
	internal class Kernel
	{
		private static StandardKernel instance;

		private static void Initialize()
		{
			instance = new StandardKernel();
		}

		public static StandardKernel Instance
		{
			get
			{
				if (instance == null)
				{
					Initialize();
				}

				return instance;
			}
		}
	}
}
