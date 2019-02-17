using System.Linq;
using System.Collections.Generic;

using CpuEmulator.Emulator.Instructions;
using CpuEmulator.Emulator.Assembler.Parser;
using CpuEmulator.Emulator.Assembler.Tokens;

namespace CpuEmulator.Emulator.Assembler.Compiler
{
	public class AssemblyCompiler
	{
		public static List<Instruction> Compile(string source)
		{
			var tokens = InstructionParser.Parse(source);
			var result = new List<Instruction>();

			tokens.ForEach(token =>
			{
				if(token is InstructionToken instructionToken)
				{
					result.Add(instructionToken.Instruction);
				}
			});

			return result;
		}
	}
}