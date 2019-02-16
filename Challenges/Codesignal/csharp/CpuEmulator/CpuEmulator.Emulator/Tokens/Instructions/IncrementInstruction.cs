using System;
using System.Numerics;

namespace CpuEmulator.Emulator.Tokens.Instructions
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
			var storedValue = machine.Memory.Read(Target);

			if (storedValue == (BigInteger)Math.Pow(2, 32) - 1)
			{
				machine.Memory.Write(Target, 0);
			}
			else
			{
				machine.Memory.Write(Target, storedValue + 1);
			}

			machine.NextInstruction();

			return machine;
		}
	}
}