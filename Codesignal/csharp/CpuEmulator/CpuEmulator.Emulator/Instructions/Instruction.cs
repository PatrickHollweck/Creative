using System.Numerics;

namespace CpuEmulator.Emulator.Instructions
{
	public interface Instruction
	{
		Machine Apply(Machine machine);
	}
}