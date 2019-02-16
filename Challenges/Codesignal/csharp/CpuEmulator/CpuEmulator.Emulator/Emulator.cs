using System.Numerics;
using System.Collections.Generic;

using CpuEmulator.Emulator.Instructions;

namespace CpuEmulator.Emulator
{
	public class Emulator
	{
		public Machine machine { get; protected set; }

		public Emulator(int memorySize)
		{
			machine = Machine.Default();
		}

		public Emulator(Machine machine)
		{
			this.machine = machine;
		}

		public static BigInteger Run(string instructions, int memorySize = 43)
		{
			var parsedInstructions = InstructionParser.Parse(instructions);

			var emulator = new Emulator(memorySize);
			emulator.Execute(parsedInstructions);

			return emulator.GetReturnValue();
		}

		public void Execute(List<Instruction> instructions)
		{
			while (machine.InstructionCounter < instructions.Count)
			{
				Step(instructions[(int)machine.InstructionCounter]);
			}

			// Reset the instruction counter so another set of instructions can be executed.
			machine.JumpToInstruction(0);
		}

		public void Step(Instruction instruction)
		{
			machine = instruction.Apply(machine);
		}

		public BigInteger GetReturnValue()
		{
			return machine.Memory.Read(RegisterAddress.FromInt(machine.Memory.Size - 1));
		}
	}
}