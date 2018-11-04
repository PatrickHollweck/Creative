using System.Numerics;

namespace CpuEmulator.Emulator.Instructions
{
	public class JumpInstruction : Instruction
	{
		public RegisterAddress Target;

		public JumpInstruction(RegisterAddress target)
		{
			Target = target;
		}

		public (VM, BigInteger) Apply(VM vm, BigInteger instructionCounter)
		{
			instructionCounter = Target.GetIndex() - 1;
			return (vm, instructionCounter);
		}
	}
}