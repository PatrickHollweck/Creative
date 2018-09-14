using System;
using System.Text.RegularExpressions;

namespace TwitchBot.Core
{
	public class OnMessageReceivedEventArgs : EventArgs
	{
		public string Username;
		public string Content;

		public string RawMessage;

		public bool IsChatMessage;
		public bool IsSystemMessage; 

		public OnMessageReceivedEventArgs(string rawMessage, string channelName)
		{
			this.RawMessage = rawMessage;

			this.Username = new Regex(@"@(.*).tmi.twitch.tv").Match(this.RawMessage).Groups[1].Value;
			this.Content = new Regex($"PRIVMSG #{channelName} :(.*)$").Match(this.RawMessage).Groups[1].Value;

			this.Username = string.IsNullOrWhiteSpace(this.Username) ? null : this.Username;
			this.Content = string.IsNullOrWhiteSpace(this.Content) ? null : this.Content;

			this.IsChatMessage = this.Content != null;
			this.IsSystemMessage = !this.IsChatMessage;
		}
	}
}
