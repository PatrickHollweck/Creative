namespace TwitchBot.Core
{
	public class Credentials
	{
		public string Username;
		public string OAuthToken;

		public Credentials(string username, string oauthToken)
		{
			this.Username = username;
			this.OAuthToken = oauthToken;
		}
	}
}
