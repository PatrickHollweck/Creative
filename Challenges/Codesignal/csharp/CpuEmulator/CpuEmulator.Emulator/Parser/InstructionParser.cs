using System;
using System.Numerics;
using System.Collections.Generic;

using CpuEmulator.Emulator.Tokens;
using CpuEmulator.Emulator.Tokens.Instructions;

namespace CpuEmulator.Emulator.Parser
{
	public class InstructionParser
	{
		public static List<Token> Parse(string source)
		{
			var result = new List<Token>();
			var lines = source.Split('\n');

			for (int i = 0; i < lines.Length; i++)
			{
				var line = lines[i];

				if(string.IsNullOrWhiteSpace(line))
				{
					continue;
				}

				var trimmedLine = line.Trim();
				var context = new ParseContext(i, trimmedLine);

				if(trimmedLine.EndsWith(":")) {
					result.Add(ParseLabel(context));
				} else {
					result.Add(ParseInstruction(context));
				}
			}

			return result;
		}

		protected static Label ParseLabel(ParseContext context)
		{
			return new Label(
				context.Source.Substring(0, context.Source.Length - 1),
				context.CurrentLineNumber
			);
		}

		protected static Instruction ParseInstruction(ParseContext context)
		{
			var tokens = context.Source.Split(' ', ',');
			var instructionName = tokens[0];

			switch (instructionName)
			{
				case "MOV":
					if(Register.IsRegister(tokens[1]))
						return new CopyMoveInstruction(RegisterAddress.FromString(tokens[1]), RegisterAddress.FromString(tokens[2]));
					else
						return new StoreMoveInstruction(uint.Parse(tokens[1]), RegisterAddress.FromString(tokens[2]));
				case "ADD":
					return new AddInstruction(RegisterAddress.FromString(tokens[1]), RegisterAddress.FromString(tokens[2]));
				case "DEC":
					return new DecrementInstruction(RegisterAddress.FromString(tokens[1]));
				case "INC":
					return new IncrementInstruction(RegisterAddress.FromString(tokens[1]));
				case "INV":
					return new InverseInstruction(RegisterAddress.FromString(tokens[1]));
				case "JMP":
					var jumpIndex = int.Parse(tokens[1]);
					return new JumpInstruction(RegisterAddress.FromInt(jumpIndex));
				case "JZ":
					var jumpZeroIndex = int.Parse(tokens[1]);
					return new JumpZeroInstruction(RegisterAddress.FromInt(jumpZeroIndex));
				case "NOP":
					return new NoOperationInstruction();
				default:
					throw new Exception($"FATAL: Unknown instruction '{instructionName}'");
			}
		}
	}
}