using System.Numerics;

namespace CpuEmulator.Emulator.Instructions
{
	public class StoreMoveInstruction : Instruction
	{
		public uint Value;
		public RegisterAddress Target;

		public StoreMoveInstruction(uint value, RegisterAddress target)
		{
			Value = value;
			Target = target;
		}

		public Machine Apply(Machine machine)
		{
			machine.Memory.Write(Target, Value);
			machine.NextInstruction();

			return machine;
		}
	}
}