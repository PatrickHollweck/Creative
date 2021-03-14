using CpuEmulator.Emulator.Instructions;

namespace CpuEmulator.Emulator.Assembler.Tokens
{
	public class InstructionToken : IToken
	{
		public readonly Instruction Instruction;

		public InstructionToken(Instruction instruction)
		{
			Instruction = instruction;
		}
	}
}