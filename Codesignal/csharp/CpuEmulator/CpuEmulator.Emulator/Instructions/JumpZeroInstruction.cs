using System.Numerics;

namespace CpuEmulator.Emulator.Instructions
{
	public class JumpZeroInstruction : Instruction
	{
		public RegisterAddress Target;

		public JumpZeroInstruction(RegisterAddress target)
		{
			Target = target;
		}

		public Machine Apply(Machine machine)
		{
			if (machine.Vm.Read(RegisterAddress.FromInt(0)) == 0)
			{
				machine.JumpToInstruction(Target.GetIndex() - 1);
			}
			else
			{
				machine.NextInstruction();
			}

			return machine;
		}
	}
}