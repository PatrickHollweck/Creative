namespace Medb.Core
{
	using System;
	using System.Collections.Generic;

	using Medb.Core.Instructions;

	public class InstructionParser
	{
		private static Dictionary<string, Type> IdentifierToInstructionMap = new Dictionary<string, Type>()
			 {
				 { "SET", typeof(SetInstruction) },
				 { "GET", typeof(GetInstruction) },
				 { "DELETE", typeof(DeleteInstruction) }
			 };

		public static ICollection<Instruction> Parse(string source)
		{
			var lines = source.Split('\n');
			var instructions = new List<Instruction>();

			foreach (var line in lines)
			{
				var instruction = ParseLineToInstruction(line);
				instructions.Add(instruction);
			}

			return instructions;
		}

		private static Instruction ParseLineToInstruction(string line)
		{
			var tokens = line.Split(' ');
			var instructionName = tokens[0];

			var instructionType = IdentifierToInstructionMap[instructionName];
			var instructionInstance = Activator.CreateInstance(instructionType) as Instruction;

			instructionInstance?.Parse(tokens);

			return instructionInstance;
		}
	}
}