using System;
using System.IO;
using System.Timers;
using StatoBot.Core;

namespace StatoBot.Analytics
{
	public class AnalyzerBot : TwitchBot
	{
		public ChatAnalyzer Analyzer;

		public AnalyzerBot(Credentials credentials, string channel) : base(credentials, channel)
		{
			Analyzer = new ChatAnalyzer();
			OnMessageReceived += Analyzer.AsHook();
		}
	}
}
