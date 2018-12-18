using System.IO;
using System.Threading.Tasks;

using Newtonsoft.Json;

namespace NoFlakeBot.Core
{
	public class Config
	{
		public string OAuthToken { get; }

		public Config(string oauthToken)
		{
			OAuthToken = oauthToken;
		}

		public static async Task<Config> FromFileAsync(string path)
		{
			var fileContent = await File.ReadAllTextAsync(path);
			return JsonConvert.DeserializeObject<Config>(fileContent);
		}
	}
}
