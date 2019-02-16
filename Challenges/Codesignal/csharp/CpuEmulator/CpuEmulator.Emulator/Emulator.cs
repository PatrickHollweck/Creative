using System.Numerics;
using System.Collections.Generic;

using CpuEmulator.Emulator.Instructions;

namespace CpuEmulator.Emulator
{
	public class Emulator
	{
		public const int REGISTER_COUNT = 43;

		protected Machine machine;

		public Emulator()
		{
			machine = Machine.Default();
		}

		public static BigInteger Run(string[] instructions)
		{
			var parsedInstructions = InstructionParser.Parse(instructions);

			var emulator = new Emulator();
			emulator.Execute(parsedInstructions);

			return emulator.GetReturnValue();
		}

		public void Execute(List<Instruction> instructions)
		{
			while (machine.InstructionCounter < instructions.Count)
			{
				machine = instructions[(int)machine.InstructionCounter].Apply(machine);
			}

			// Reset the instruction counter so another set of instructions can be executed.
			machine.JumpToInstruction(0);
		}

		public BigInteger GetReturnValue()
		{
			return machine.Memory.Read(RegisterAddress.FromInt(42));
		}
	}
}