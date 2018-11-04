using System.Numerics;

namespace CpuEmulator.Emulator.Instructions
{
	public class CopyMoveInstruction : Instruction
	{
		public RegisterAddress From;
		public RegisterAddress To;

		public CopyMoveInstruction(RegisterAddress from, RegisterAddress to)
		{
			From = from;
			To = to;
		}

		public (VM, BigInteger) Apply(VM vm, BigInteger instructionCounter)
		{
			vm.Write(To, vm.Read(From));
			return (vm, instructionCounter + 1);
		}
	}
}