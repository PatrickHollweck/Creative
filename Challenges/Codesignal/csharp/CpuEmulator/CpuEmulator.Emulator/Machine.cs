using System.Numerics;

namespace CpuEmulator.Emulator
{
	public sealed class Machine
	{
		public VM Vm { get; set; }
		public BigInteger InstructionCounter { get; set; }

		private Machine(VM vm, BigInteger instructionCounter)
		{
			Vm = vm;
			InstructionCounter = instructionCounter;
		}

		public static Machine Default()
		{
			return new Machine(new VM(), 0);
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