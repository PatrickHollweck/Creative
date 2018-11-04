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

		public (VM, BigInteger) Apply(VM vm, BigInteger instructionCounter)
		{
			if (vm.Read(RegisterAddress.FromInt(0)) == 0)
			{
				instructionCounter = Target.GetIndex() - 1;
				return (vm, instructionCounter);
			}

			return (vm, instructionCounter + 1);
		}
	}
}