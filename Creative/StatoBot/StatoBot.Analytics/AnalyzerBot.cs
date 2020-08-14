using StatoBot.Core;

namespace StatoBot.Analytics
{
    public class AnalyzerBot : TwitchBot
    {
        public ChatAnalyzer Analyzer;

        public AnalyzerBot(Credentials credentials, string channel) : base(credentials, channel)
        {
            Analyzer = new ChatAnalyzer();
            OnMessageReceived += AnalyzeMessage;
        }

        private void AnalyzeMessage(object sender, OnMessageReceivedEventArgs args)
        {
			Analyzer.Analyze(args.Message);
        }
    }
}
