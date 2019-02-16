using System;
using System.Numerics;
using System.Collections.Generic;

using CpuEmulator.Emulator.Instructions;

using CpuEmulator.Emulator.Assembler;
using CpuEmulator.Emulator.Assembler.Tokens;

namespace CpuEmulator.Emulator.Assembler.Parser
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
				ParseLabelName(context.Source),
				context.CurrentLineNumber
			);
		}

		protected static Token ParseInstruction(ParseContext context)
		{
			var tokens = context.Source.Split(' ', ',');
			var instructionName = tokens[0];

			switch (instructionName)
			{
				case "MOV":
					if(Register.IsRegister(tokens[1]))
						return InstructionToToken(new CopyMoveInstruction(RegisterAddress.FromString(tokens[1]), RegisterAddress.FromString(tokens[2])));
					else
						return InstructionToToken(new StoreMoveInstruction(uint.Parse(tokens[1]), RegisterAddress.FromString(tokens[2])));
				case "ADD":
					return InstructionToToken(new AddInstruction(RegisterAddress.FromString(tokens[1]), RegisterAddress.FromString(tokens[2])));
				case "DEC":
					return InstructionToToken(new DecrementInstruction(RegisterAddress.FromString(tokens[1])));
				case "INC":
					return InstructionToToken(new IncrementInstruction(RegisterAddress.FromString(tokens[1])));
				case "INV":
					return InstructionToToken(new InverseInstruction(RegisterAddress.FromString(tokens[1])));
				case "JMP":
					var jumpIndex = int.Parse(tokens[1]);
					return InstructionToToken(new JumpInstruction(RegisterAddress.FromInt(jumpIndex)));
				case "JZ":
					var jumpZeroIndex = int.Parse(tokens[1]);
					return InstructionToToken(new JumpZeroInstruction(RegisterAddress.FromInt(jumpZeroIndex)));
				case "CALL":
					return new CallToken(ParseLabelName(context.Source));
				case "NOP":
					return InstructionToToken(new NoOperationInstruction());
				default:
					throw new Exception($"FATAL: Unknown instruction '{instructionName}'");
			}
		}

		protected static Token InstructionToToken(Instruction instruction)
		{
			return new InstructionToken(instruction);
		}

		protected static string ParseLabelName(string label)
		{
			return label.Substring(0, label.Length - 1);
		}
	}
}