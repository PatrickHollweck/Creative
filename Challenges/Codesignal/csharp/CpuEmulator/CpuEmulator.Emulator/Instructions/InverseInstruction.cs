using System.Numerics;

namespace CpuEmulator.Emulator.Instructions
{
	public class InverseInstruction : Instruction
	{
		public RegisterAddress Target;

		public InverseInstruction(RegisterAddress target)
		{
			Target = target;
		}

		public Machine Apply(Machine machine)
		{
			machine.Memory.Write(Target, ~machine.Memory.Read(Target));
			machine.NextInstruction();

			return machine;
		}
	}
}