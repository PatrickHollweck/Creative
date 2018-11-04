using System.Numerics;

namespace CpuEmulator.Emulator.Instructions
{
	public class NoOperationInstruction : Instruction
	{
		public (VM, BigInteger) Apply(VM vm, BigInteger instructionCounter)
		{
			return (vm, instructionCounter + 1);
		}
	}
}