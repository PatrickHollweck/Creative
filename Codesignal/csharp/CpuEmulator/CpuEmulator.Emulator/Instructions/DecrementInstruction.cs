using System;
using System.Numerics;

namespace CpuEmulator.Emulator.Instructions
{
	public class DecrementInstruction : Instruction
	{
		public RegisterAddress Target;

		public DecrementInstruction(RegisterAddress target)
		{
			Target = target;
		}

		public Machine Apply(Machine machine)
		{
			var storedValue = machine.Vm.Read(Target);

			if (storedValue == 0)
			{
				machine.Vm.Write(Target, (uint)Math.Pow(2, 32) - 1);
			}
			else
			{
				machine.Vm.Write(Target, storedValue - 1);
			}

			machine.NextInstruction();

			return machine;
		}
	}
}