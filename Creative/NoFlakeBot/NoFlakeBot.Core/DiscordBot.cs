using System.Threading.Tasks;

using Discord;
using Discord.WebSocket;

namespace NoFlakeBot.Core
{
	public class DiscordBot
	{
		protected readonly DiscordSocketClient Client;
		protected readonly Config Config;

		public DiscordBot(Config config)
		{
			Client = new DiscordSocketClient();
			Config = config;
		}

		public static async Task StartOfConfig(Config config)
		{
			var bot = new DiscordBot(config);
			await bot.Run();
		}

		public async Task Run()
		{
			await Client.LoginAsync(TokenType.Bot, Config.OAuthToken);
			await Client.StartAsync();

			await Task.Delay(-1);
		}
	}
}
