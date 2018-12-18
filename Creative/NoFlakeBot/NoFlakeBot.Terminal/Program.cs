using System.Threading.Tasks;

using NoFlakeBot.Core;

namespace NoFlakeBot.Terminal
{
	internal static class Program
	{
		private static void Main(string[] args)
		{
			MainAsync(args)
				.GetAwaiter()
				.GetResult();
		}

		private static async Task MainAsync(string[] args)
		{
			var config = await Config.FromFileAsync("./config.json");
			var bot = new NoFlakeDiscordBot(config);

			await bot.Run();
		}
	}
}
