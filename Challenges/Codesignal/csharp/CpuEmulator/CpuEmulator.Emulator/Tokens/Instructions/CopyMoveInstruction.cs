using System.Numerics;

namespace CpuEmulator.Emulator.Tokens.Instructions
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
			machine.Memory.Write(To, machine.Memory.Read(From));
			machine.NextInstruction();

			return machine;
		}
	}
}