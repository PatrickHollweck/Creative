using System.Numerics;
using CpuEmulator.Emulator.Tokens;

namespace CpuEmulator.Emulator.Tokens.Instructions
{
	public interface Instruction : Token
	{
		Machine Apply(Machine machine);
	}
}