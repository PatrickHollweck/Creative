using System;

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

		public Machine Apply(Machine machine)
		{
			machine.Vm.Write(A, (uint)((machine.Vm.Read(A) + machine.Vm.Read(B)) % Math.Pow(2, 32)));
			machine.NextInstruction();

			return machine;
		}
	}
}