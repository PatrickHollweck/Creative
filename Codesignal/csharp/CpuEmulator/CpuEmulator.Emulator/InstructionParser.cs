using System;
using System.Collections.Generic;
using CpuEmulator.Emulator.Exceptions;
using CpuEmulator.Emulator.Instructions;

namespace CpuEmulator.Emulator
{
	public class InstructionParser
	{
		public static List<Instruction> Parse(string[] instructions)
		{
			var result = new List<Instruction>();

			foreach (var instruction in instructions)
			{
				result.Add(ParseSingle(instruction));
			}

			return result;
		}

		protected static Instruction ParseSingle(string instruction)
		{
			var tokens = instruction.Split(' ', ',');
			var instructionName = tokens[0];

			switch (instructionName)
			{
				case "MOV":
					if (uint.TryParse(tokens[1], out uint result))
						return new StoreMoveInstruction(result, RegisterAddress.FromString(tokens[2]));
					else
						return new CopyMoveInstruction(RegisterAddress.FromString(tokens[1]), RegisterAddress.FromString(tokens[2]));
				case "ADD":
					return new AddInstruction(RegisterAddress.FromString(tokens[1]), RegisterAddress.FromString(tokens[2]));
				case "DEC":
					return new DecrementInstruction(RegisterAddress.FromString(tokens[1]));
				case "INC":
					return new IncrementInstruction(RegisterAddress.FromString(tokens[2]));
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