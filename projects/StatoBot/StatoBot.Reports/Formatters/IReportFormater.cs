namespace StatoBot.Reports.Formatters
{
	public interface IReportFormatter
	{
		string FileExtension { get;  }

		string Format(Report report);
	}
}
