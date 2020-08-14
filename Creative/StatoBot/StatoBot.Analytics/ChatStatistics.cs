namespace StatoBot.Analytics
{
	public class ChatStatistics
	{
		public readonly CountStatistics Words;
		public readonly CountStatistics Letters;
		public readonly CountStatistics Users;
		public readonly CountStatistics Messages;

		public ChatStatistics()
		{
			Words = new CountStatistics();
			Letters = new CountStatistics();
			Users = new CountStatistics();
			Messages = new CountStatistics();
		}
	}
}