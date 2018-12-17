using System.Numerics;

namespace CpuEmulator.Emulator.Instructions
{
	public class JumpInstruction : Instruction
	{
		public RegisterAddress Target;

		public JumpInstruction(RegisterAddress target)
		{
			Target = target;
		}

		public Machine Apply(Machine machine)
		{
			machine.JumpToInstruction(Target.GetIndex() - 1);

			return machine;
		}
	}
}