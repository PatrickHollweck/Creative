using System.Numerics;
using System.Collections.Generic;

using CpuEmulator.Emulator.Instructions;
using CpuEmulator.Emulator.Assembler.Compiler;

namespace CpuEmulator.Emulator
{
	public class Emulator
	{
		public Machine Machine { get; protected set; }

		public Emulator(int memorySize)
		{
			Machine = new Machine(new Memory(memorySize), 0);
		}

		public Emulator(Machine machine)
		{
			this.Machine = machine;
		}

		public static BigInteger Run(string source, int memorySize = 43)
		{
			var instructions = AssemblyCompiler.Compile(source);

			var emulator = new Emulator(memorySize);
			emulator.Execute(instructions);

			return emulator.GetReturnValue();
		}

		public void Execute(List<Instruction> instructions)
		{
			while (Machine.InstructionCounter < instructions.Count)
			{
				Step(instructions[(int)Machine.InstructionCounter]);
			}

			// Reset the instruction counter so another set of instructions can be executed.
			Machine.JumpToInstruction(0);
		}

		public void Step(Instruction instruction)
		{
			Machine = instruction.Apply(Machine);
		}

		public BigInteger GetReturnValue()
		{
			return Machine.Memory.Read(RegisterAddress.FromInt(Machine.Memory.Size - 1));
		}
	}
}