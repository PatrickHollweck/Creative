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
			machine.Vm.Write(Target, ~machine.Vm.Read(Target));
			machine.NextInstruction();

			return machine;
		}
	}
}