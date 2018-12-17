using System.Linq;
using System.Collections.Generic;

public static class RnaTranscription
{
	public enum DNA
	{
		Adenine = 'A',
		Cytosine = 'C',
		Guanine = 'G',
		Thymine = 'T'
	}

	public enum RNA
	{
		Adenine = 'A',
		Cytosine = 'C',
		Guanine = 'G',
		Uracil = 'U'
	}

	public static string ToRna(string dna)
	{
		return dna
			.Select(nucleotide => DnaToRnaMappings[(DNA) nucleotide])
			.Aggregate(string.Empty, (result, nucleotide) => result += (char) nucleotide);
	}


	private static readonly Dictionary<DNA, RNA> DnaToRnaMappings = new Dictionary<DNA, RNA>()
	{
		{ DNA.Guanine, RNA.Cytosine },
		{ DNA.Cytosine, RNA.Guanine },
		{ DNA.Thymine, RNA.Adenine },
		{ DNA.Adenine, RNA.Uracil }
	};
}