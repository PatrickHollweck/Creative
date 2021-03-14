using System.Numerics;

namespace CpuEmulator.Emulator
{
	public class Machine
	{
		/// <summary>
		/// Gets or sets the Memory of ths Machine.
		/// </summary>
		public Memory Memory { get; set; }

		/// <summary>
		/// Gets or sets the InstructionCounter.
		/// The Instruction counter always points to the instruction that should be executed next.
		/// </summary>
		public BigInteger InstructionCounter { get; protected set; }

		/// <summary>
		/// Constructs a Machine.
		/// </summary>
		/// <param name="memory">The memory</param>
		/// <param name="instructionCounter">The Instruction counter</param>
		public Machine(Memory memory, BigInteger instructionCounter)
		{
			Memory = memory;
			InstructionCounter = instructionCounter;
		}

		/// <summary>
		/// A default machine.
		/// </summary>
		/// <returns>The machine</returns>
		public static Machine Default()
		{
			return new Machine(new Memory(43), 0);
		}

		/// <summary>
		/// Sets the Instruction counter to the next instruction.
		/// </summary>
		public void NextInstruction()
		{
			InstructionCounter++;
		}

		/// <summary>
		/// Jumps to the specified address.
		/// </summary>
		/// <param name="index">The address to jump to</param>
		public void JumpToInstruction(int index)
		{
			InstructionCounter = index;
		}
	}
}