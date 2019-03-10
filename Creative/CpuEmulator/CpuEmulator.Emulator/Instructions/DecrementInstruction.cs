using System;

namespace CpuEmulator.Emulator.Instructions
{
	/// <summary>
	/// A Decrement instruction simply decrements the value of a Register
	/// </summary>
	public class DecrementInstruction : Instruction
	{
		/// <summary>
		/// Gets or sets the target address of a memory cell to decrement.
		/// </summary>
		public RegisterAddress Target { get; protected set; }

		/// <summary>
		/// Constructs a Decrement Instruction
		/// </summary>
		/// <param name="target">The target address to decrement</param>
		public DecrementInstruction(RegisterAddress target)
		{
			Target = target;
		}

		/// <summary>
		/// Executes this instruction on a machine.
		/// </summary>
		/// <param name="machine">The machine to execute the instruction on</param>
		/// <returns>The machine after the instruction was applied.</returns>
		public Machine Apply(Machine machine)
		{
			var storedValue = machine.Memory.Read(Target);

			if (storedValue == 0)
			{
				machine.Memory.Write(Target, (uint)Math.Pow(2, 32) - 1);
			}
			else
			{
				machine.Memory.Write(Target, storedValue - 1);
			}

			machine.NextInstruction();

			return machine;
		}
	}
}