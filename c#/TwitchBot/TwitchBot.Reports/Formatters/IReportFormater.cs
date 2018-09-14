namespace TwitchBot.Reports.Formatters
{
	public interface ReportFormatter
	{
		string Format(Report report);
	}
}
