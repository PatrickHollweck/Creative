using System.Numerics;

namespace CpuEmulator.Emulator.Instructions
{
	public class StoreMoveInstruction : Instruction
	{
		public uint Value;
		public RegisterAddress Target;

		public StoreMoveInstruction(uint value, RegisterAddress target)
		{
			Value = value;
			Target = target;
		}

		public (VM, BigInteger) Apply(VM vm, BigInteger instructionCounter)
		{
			vm.Write(Target, Value);
			return (vm, instructionCounter + 1);
		}
	}
}