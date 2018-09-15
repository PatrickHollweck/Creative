namespace StatoBot.Analytics
{
	public class SaveFilePayload
	{
		public Statistics Words;
		public Statistics Letters;
		public Statistics Users;

		public SaveFilePayload(Statistics words, Statistics letters, Statistics users)
		{
			Words = words;
			Letters = letters;
			Users = users;
		}

		public static SaveFilePayload FromAnalyzer(ChatAnalyzer analyzer)
		{
			return new SaveFilePayload(analyzer.WordStatistics, analyzer.LetterStatistics, analyzer.UserStatistics);
		}
	}
}