using System.Numerics;
using System.Collections.Generic;

using CpuEmulator.Emulator.Instructions;
using CpuEmulator.Emulator.Assembler.Compiler;

namespace CpuEmulator.Emulator
{
	/// <summary>
	/// The CPU-Emulator Master class
	/// </summary>
	public class Emulator
	{
		/// <summary>
		/// Gets or sets the emulated machine.
		/// </summary>
		public Machine Machine { get; protected set; }

		/// <summary>
		/// Constructs a Emulator with the specified memory size
		/// </summary>
		/// <param name="memorySize">The memory size of the Emulator</param>
		public Emulator(int memorySize)
		{
			Machine = new Machine(new Memory(memorySize), 0);
		}

		/// <summary>
		/// Constructs a Emulator from a pre-existing Machine.
		/// </summary>
		/// <param name="machine">The machine that the Emulator should be constructed with</param>
		public Emulator(Machine machine)
		{
			Machine = machine;
		}

		/// <summary>
		/// Runs the given source text
		/// </summary>
		/// <param name="source">The source to execute</param>
		/// <param name="memorySize">The size the memory should have</param>
		/// <returns>The return value of the program</returns>
		public static BigInteger Run(string source, int memorySize = 43)
		{
			var instructions = AssemblyCompiler.Compile(source);

			var emulator = new Emulator(memorySize);
			emulator.Execute(instructions);

			return emulator.GetReturnValue();
		}

		/// <summary>
		/// Runs the specified instructions on the Emulator
		/// </summary>
		/// <param name="instructions">The instructions to run</param>
		public void Execute(List<Instruction> instructions)
		{
			while (Machine.InstructionCounter < instructions.Count)
			{
				Step(instructions[(int)Machine.InstructionCounter]);
			}

			// Reset the instruction counter so another set of instructions can be executed.
			Machine.JumpToInstruction(0);
		}

		/// <summary>
		/// "Steps" on instruction forwards - Executes a single instruction.
		/// </summary>
		/// <param name="instruction">The instruction to execute.</param>
		public void Step(Instruction instruction)
		{
			Machine = instruction.Apply(Machine);
		}

		/// <summary>
		/// Gets the return value of the program - The return value is always the last memory cell.
		/// </summary>
		/// <returns>The return value of the program</returns>
		public BigInteger GetReturnValue()
		{
			return Machine.Memory.Read(RegisterAddress.FromInt(Machine.Memory.Size - 1));
		}
	}
}