using System;
using System.Linq;
using System.Globalization;

public static class Bob
{
	public static string Response(string text)
	{
		var cases = new StatementCase[]
		{
			new StatementCase(
				"Sure.",
				statement => statement.IsQuestion() && !statement.IsYelled() && !statement.IsSilence()
			),
			new StatementCase(
				"Whoa, chill out!",
				statement => statement.IsYelled() && !statement.IsQuestion() && !statement.IsSilence()
			),
			new StatementCase(
				"Fine. Be that way!",
				statement => statement.IsSilence() && !statement.IsYelled() && !statement.IsQuestion()
			),
			new StatementCase(
				"Calm down, I know wham I'm doing",
				statement => statement.IsYelled() && statement.IsQuestion() && !statement.IsSilence()
			),
			new StatementCase(
				"Whatever.",
				statement => !statement.IsSilence() && !statement.IsQuestion() && !statement.IsYelled()
			),
		};

		var acutalStatement = new Statement(text);

		return cases
			.Where(currentCase => currentCase.Appiles(acutalStatement))
			.First()
			.GetResponse();
	}
}

public class Statement
{
	protected string Text;

	public Statement(string text)
	{
		Text = text;
	}

	public bool IsYelled()
	{
		var upperCaseCharacters = Text
			.Where(character => char.IsUpper(character))
			.Count();

		return upperCaseCharacters == Text.Count();
	}

	public bool IsQuestion()
	{
		return TextEndsWith("?");
	}

	public bool IsSilence()
	{
		return string.IsNullOrWhiteSpace(Text);
	}

	protected bool TextEndsWith(string end)
	{
		return Text.Trim().EndsWith(end);
	}
}

public class StatementCase
{
	protected string Response;
	protected Func<Statement, bool> Predicate;

	public StatementCase(string response, Func<Statement, bool> predicate)
	{
		Response = response;
		Predicate = predicate;
	}

	public bool Appiles(Statement analyzer)
	{
		return Predicate(analyzer);
	}

	public string GetResponse()
	{
		return Response;
	}
}