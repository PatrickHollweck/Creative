using System.IO;
using Newtonsoft.Json;

namespace StatoBot.Core
{
	public class Credentials
	{
		public string UserName { get; internal set; }
		public string OAuthToken { get; internal set; }

		public Credentials(string userName, string oauthToken)
		{
			UserName = userName;
			OAuthToken = oauthToken;
		}

		public static Credentials FromFile(string path)
		{
			var content = File.ReadAllText(path);
			return JsonConvert.DeserializeObject<Credentials>(content);
		}
	}
}
