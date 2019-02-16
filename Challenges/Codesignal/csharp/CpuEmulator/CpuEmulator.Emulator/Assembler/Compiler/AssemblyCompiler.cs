using System.Linq;
using System.Collections.Generic;

using CpuEmulator.Emulator.Instructions;
using CpuEmulator.Emulator.Assembler.Parser;

namespace CpuEmulator.Emulator.Assembler.Compiler
{
	public class AssemblyCompiler
	{
		public static List<Instruction> Compile(string source)
		{
			var tokens = InstructionParser.Parse(source);

			return tokens.Where(t => t is Instruction) as List<Instruction>;
		}
	}
}