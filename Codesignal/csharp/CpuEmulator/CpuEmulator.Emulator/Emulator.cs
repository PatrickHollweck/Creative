using System.Collections.Generic;
using System.Numerics;
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
		}

		public BigInteger GetReturnValue()
		{
			return machine.Vm.Read(RegisterAddress.FromInt(42));
		}
	}
}