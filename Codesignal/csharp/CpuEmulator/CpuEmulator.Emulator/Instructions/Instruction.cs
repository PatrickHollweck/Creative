using System.Numerics;

namespace CpuEmulator.Emulator.Instructions
{
	public interface Instruction
	{
		(VM vm, BigInteger instructionCounter) Apply(VM vm, BigInteger instructionCounter);
	}
}