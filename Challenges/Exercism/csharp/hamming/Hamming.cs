using System;
using System.Linq;

public static class Hamming
{
	public static int Distance(string firstStrand, string secondStrand)
	{
		if (firstStrand.Length != secondStrand.Length)
			throw new ArgumentException("Strands must be of equal length!");

		return firstStrand
			.Where((element, index) => secondStrand[index] != element)
			.Count();
	}
}