using System.Numerics;

namespace CpuEmulator.Emulator.Tokens.Instructions
{
	public class NoOperationInstruction : Instruction
	{
		public Machine Apply(Machine machine)
		{
			machine.NextInstruction();

			return machine;
		}
	}
}