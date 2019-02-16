using System.Numerics;

namespace CpuEmulator.Emulator
{
	public class Machine
	{
		public Memory Memory { get; set; }

		public BigInteger InstructionCounter { get; protected set; }

		public Machine(Memory memory, BigInteger instructionCounter)
		{
			Memory = memory;
			InstructionCounter = instructionCounter;
		}

		public static Machine Default()
		{
			return new Machine(new Memory(43), 0);
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