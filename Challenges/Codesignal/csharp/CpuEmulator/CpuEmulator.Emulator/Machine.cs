using System.Numerics;

namespace CpuEmulator.Emulator
{
	public sealed class Machine
	{
		public Memory Memory { get; set; }
		public BigInteger InstructionCounter { get; set; }

		private Machine(Memory memory, BigInteger instructionCounter)
		{
			Memory = memory;
			InstructionCounter = instructionCounter;
		}

		public static Machine Default()
		{
			return new Machine(new Memory(), 0);
		}

		public void NextInstruction()
		{
			InstructionCounter++;
		}

		public void JumpToInstruction(int index)
		{
			InstructionCounter = index;
		}
	}
}