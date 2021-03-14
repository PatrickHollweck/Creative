using Newtonsoft.Json;

namespace StatoBot.Reports.Formatters
{
	public class JsonFormatter : IReportFormatter
	{
		public string FileExtension => ".json";

		public string Format(Report report)
		{
			return JsonConvert.SerializeObject(report.Statistics, Formatting.Indented);
		}
	}
}
