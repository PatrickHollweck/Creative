public static class Pangram
{
	public static bool IsPangram(string input)
	{
		foreach (char character in GetAlphabet())
		{
			if (!input.ToLower().Contains(character))
				return false;
		}

		return true;
	}

	public static string GetAlphabet()
	{
		return "abcdefghijklmnopqrstuvwxyz";
	}
}
