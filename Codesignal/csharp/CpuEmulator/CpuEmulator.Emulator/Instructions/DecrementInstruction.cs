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

		public (VM, BigInteger) Apply(VM vm, BigInteger instructionCounter)
		{
			var storedValue = vm.Read(Target);

			if (storedValue == 0)
			{
				vm.Write(Target, (uint)Math.Pow(2, 32) - 1);
			}
			else
			{
				vm.Write(Target, storedValue - 1);
			}

			return (vm, instructionCounter + 1);
		}
	}
}