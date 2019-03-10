using System;
using System.Collections.Generic;

using CpuEmulator.Emulator.Instructions;
using CpuEmulator.Emulator.Assembler.Tokens;

namespace CpuEmulator.Emulator.Assembler.Parser
{
	/// <summary>
	/// An instruction Parser.
	/// Takes a string and parses instruction out of it.
	/// </summary>
	public class InstructionParser
	{
		/// <summary>
		/// Parses a string of assembly source code.
		/// </summary>
		/// <param name="source">A string containing the instructions</param>
		/// <returns>A list of <list type="IToken">Tokens</list></returns>
		public static List<IToken> Parse(string source)
		{
			var result = new List<IToken>();
			var lines = source.Split('\n');

			for (int i = 0; i < lines.Length; i++)
			{
				var line = lines[i];

				if (string.IsNullOrWhiteSpace(line))
				{
					continue;
				}

				var trimmedLine = line.Trim();
				var context = new ParseContext(i, trimmedLine);

				result.Add(trimmedLine.EndsWith(":") ? ParseLabel(context) : ParseInstruction(context));
			}

			return result;
		}

		/// <summary>
		/// Parses a Label.
		/// </summary>
		/// <param name="context">The parsing sub-context</param>
		/// <returns>The label</returns>
		protected static Label ParseLabel(ParseContext context)
		{
			return new Label(
				ParseLabelName(context.Source),
				context.CurrentLineNumber
			);
		}

		/// <summary>
		/// Parses a single instruction.
		/// </summary>
		/// <param name="context">The Parsing sub-context</param>
		/// <returns>The Instruction wrapped in an IToken</returns>
		protected static IToken ParseInstruction(ParseContext context)
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

		/// <summary>
		/// Converts a Instruction to a Token
		/// </summary>
		/// <param name="instruction">The instruction to convert.</param>
		/// <returns>The token</returns>
		protected static IToken InstructionToToken(Instruction instruction)
		{
			return new InstructionToken(instruction);
		}

		/// <summary>
		/// Parses a label name out of a label declaration.
		/// </summary>
		/// <param name="label">The label declaration source.</param>
		/// <returns>The label name</returns>
		protected static string ParseLabelName(string label)
		{
			return label.Substring(0, label.Length - 1);
		}
	}
}