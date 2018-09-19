namespace StatoBot.Analytics
{
	public class ChatStatistics
	{
		public Statistics Words { get; }
		public Statistics Letters { get;}
		public Statistics Users { get; }
		public Statistics Messages { get; }

		public ChatStatistics()
		{
			Words = new Statistics();
			Letters = new Statistics();
			Users = new Statistics();
			Messages = new Statistics();
		}
	}
}