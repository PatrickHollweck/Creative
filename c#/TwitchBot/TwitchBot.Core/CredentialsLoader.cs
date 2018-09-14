
using System.IO;
using Newtonsoft.Json;

namespace TwitchBot.Core
{
	public class CredentialsLoader
	{
		public static Credentials FromFile(string path)
		{
			var content = File.ReadAllText(path);
			return JsonConvert.DeserializeObject<Credentials>(content);
		}
	}
}
