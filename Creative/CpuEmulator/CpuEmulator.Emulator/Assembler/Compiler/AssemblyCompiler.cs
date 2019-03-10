using System.Collections.Generic;

using CpuEmulator.Emulator.Instructions;
using CpuEmulator.Emulator.Assembler.Parser;
using CpuEmulator.Emulator.Assembler.Tokens;

namespace CpuEmulator.Emulator.Assembler.Compiler
{
	/// <summary>
	/// The assembly compiler.
	/// Transforms a source-string to a list of instructions that can be executed by the virtual machine.
	/// </summary>
	public static class AssemblyCompiler
	{
		/// <summary>
		/// Compiles a given source to a list of instructions
		/// </summary>
		/// <param name="source">The source code</param>
		/// <returns>The instructions parsed out of the source.</returns>
		public static List<Instruction> Compile(string source)
		{
			var tokens = InstructionParser.Parse(source);
			var result = new List<Instruction>();

			tokens.ForEach(token =>
			{
				if (token is InstructionToken instructionToken)
				{
					result.Add(instructionToken.Instruction);
				}

				// TODO: Do further processing - Aka optimize and pre-process and labels.
			});

			return result;
		}
	}
}