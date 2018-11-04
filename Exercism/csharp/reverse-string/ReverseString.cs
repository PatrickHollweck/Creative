using System;
using System.Linq;

public static class ReverseString
{
	public static string Reverse(string input)
	{
		return input
			.Reverse()
			.Aggregate("", (acc, current) => acc += current);
	}
}