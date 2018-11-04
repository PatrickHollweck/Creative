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

		public (VM, BigInteger) Apply(VM vm, BigInteger instructionCounter)
		{
			var storedValue = vm.Read(Target);

			if (storedValue == (BigInteger)Math.Pow(2, 32) - 1)
			{
				vm.Write(Target, 0);
			}
			else
			{
				vm.Write(Target, storedValue + 1);
			}

			return (vm, instructionCounter + 1);
		}
	}
}