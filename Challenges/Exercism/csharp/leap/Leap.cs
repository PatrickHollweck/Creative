using System;

public static class Leap
{
	public static bool IsLeapYear(int year)
	{
		return IsEvenlyDevisible(year, 4) && (!IsEvenlyDevisible(year, 100) || IsEvenlyDevisible(year, 400));
	}

	private static bool IsEvenlyDevisible(int num, int devisor)
	{
		return num % devisor == 0;
	}
}