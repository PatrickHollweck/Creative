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

		public Machine Apply(Machine machine)
		{
			machine.Vm.Write(To, machine.Vm.Read(From));
			machine.NextInstruction();

			return machine;
		}
	}
}