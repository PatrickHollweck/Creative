using System;
using System.Numerics;

namespace CpuEmulator.Emulator.Instructions
{
	public class IncrementInstruction : Instruction
	{
		public RegisterAddress Target;

		public IncrementInstruction(RegisterAddress target)
		{
			Target = target;
		}

		public Machine Apply(Machine machine)
		{
			var storedValue = machine.Vm.Read(Target);

			if (storedValue == (BigInteger)Math.Pow(2, 32) - 1)
			{
				machine.Vm.Write(Target, 0);
			}
			else
			{
				machine.Vm.Write(Target, storedValue + 1);
			}

			machine.NextInstruction();

			return machine;
		}
	}
}