using System.Collections.Generic;
using System.Numerics;
using CpuEmulator.Emulator.Instructions;

namespace CpuEmulator.Emulator
{
	public class Emulator
	{
		public const int REGISTER_COUNT = 43;

		protected VM Vm;

		protected Emulator()
		{
			Vm = new VM();
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
			BigInteger instructionCounter = 0;
			while (instructionCounter < instructions.Count)
			{
				(Vm, instructionCounter) = instructions[(int)instructionCounter].Apply(Vm, instructionCounter);
			}
		}

		public BigInteger GetReturnValue()
		{
			return Vm.Read(RegisterAddress.FromInt(42));
		}
	}
}