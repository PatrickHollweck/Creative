using System.Numerics;

namespace CpuEmulator.Emulator.Assembler.Tokens
{
	/// <summary>
	/// Represents a Label
	/// </summary>
	public class Label : IToken
	{
		/// <summary>
		/// The first instruction of this Label.
		/// </summary>
		public readonly BigInteger FirstInstructionIndex;

		/// <summary>
		/// The Name of this Label.
		/// </summary>
		public readonly string Name;

		/// <summary>
		/// Constructs a Label
		/// </summary>
		/// <param name="name">The name of the Label</param>
		/// <param name="firstInstructionIndex">The first instruction of this Label</param>
		public Label(string name, BigInteger firstInstructionIndex)
		{
			Name = name;
			FirstInstructionIndex = firstInstructionIndex;
		}
	}
}