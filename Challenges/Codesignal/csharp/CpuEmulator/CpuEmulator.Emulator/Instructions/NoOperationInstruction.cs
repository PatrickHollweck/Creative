using System.Numerics;

namespace CpuEmulator.Emulator.Instructions
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