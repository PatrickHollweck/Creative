using System;
using System.Numerics;

namespace CpuEmulator.Emulator.Instructions
{
	public class AddInstruction : Instruction
	{
		public RegisterAddress A;
		public RegisterAddress B;

		public AddInstruction(RegisterAddress a, RegisterAddress b)
		{
			A = a;
			B = b;
		}

		public (VM, BigInteger) Apply(VM vm, BigInteger instructionCounter)
		{
			vm.Write(A, (vm.Read(A) + vm.Read(B)) % (uint)Math.Pow(2, 32));
			return (vm, instructionCounter + 1);
		}
	}
}