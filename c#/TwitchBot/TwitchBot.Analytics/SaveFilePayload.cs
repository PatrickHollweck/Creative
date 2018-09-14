namespace TwitchBot.Analytics
{
	public class SaveFilePayload
	{
		public StatisticsCollection Words;
		public StatisticsCollection Letters;
		public StatisticsCollection Users;

		public SaveFilePayload(StatisticsCollection words, StatisticsCollection letters, StatisticsCollection users)
		{
			this.Words = words;
			this.Letters = letters;
			this.Users = users;
		}

		public static SaveFilePayload FromAnalyzer(ChatAnalyzer analyzer)
		{
			return new SaveFilePayload(analyzer.GetWords(), analyzer.GetLetters(), analyzer.GetUsers());
		}
	}
}