using System;
using System.Text.RegularExpressions;

namespace TwitchBot.Core
{
	public class OnMessageReceivedEventArgs : EventArgs
	{
		public readonly string Author;
		public readonly string Content;

		public readonly string RawMessage;

		public readonly bool IsChatMessage;
		public readonly bool IsSystemMessage;

		public readonly TwitchBot Bot;

		public OnMessageReceivedEventArgs(string rawMessage, TwitchBot bot)
		{
			this.Bot = bot;
			this.RawMessage = rawMessage;

			this.Author = new Regex(@"@(.*).tmi.twitch.tv").Match(this.RawMessage).Groups[1].Value;
			this.Content = new Regex($"PRIVMSG #{this.Bot.Channel} :(.*)$").Match(this.RawMessage).Groups[1].Value;

			this.Author = string.IsNullOrWhiteSpace(this.Author) ? null : this.Author;
			this.Content = string.IsNullOrWhiteSpace(this.Content) ? null : this.Content;

			this.IsChatMessage = this.Content != null;
			this.IsSystemMessage = !this.IsChatMessage;
		}
	}
}
