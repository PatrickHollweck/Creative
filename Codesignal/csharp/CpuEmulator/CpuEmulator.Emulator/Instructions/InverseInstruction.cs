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

		public (VM, BigInteger) Apply(VM vm, BigInteger instructionCounter)
		{
			vm.Write(Target, ~vm.Read(Target));
			return (vm, instructionCounter + 1);
		}
	}
}