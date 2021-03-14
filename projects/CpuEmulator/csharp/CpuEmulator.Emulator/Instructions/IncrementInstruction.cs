using System;
using System.Numerics;

namespace CpuEmulator.Emulator.Instructions
{
	/// <summary>
	/// A Increment Instruction simply Increments a value.
	/// </summary>
	public class IncrementInstruction : Instruction
	{
		/// <summary>
		/// Gets or sets the address of a value that should be incremented.
		/// </summary>
		public RegisterAddress Target { get; protected set; }

		/// <summary>
		/// Constructs a Increment Instruction
		/// </summary>
		/// <param name="target">The address of the target value to increment</param>
		public IncrementInstruction(RegisterAddress target)
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

			if (storedValue == (BigInteger)Math.Pow(2, 32) - 1)
			{
				machine.Memory.Write(Target, 0);
			}
			else
			{
				machine.Memory.Write(Target, storedValue + 1);
			}

			machine.NextInstruction();

			return machine;
		}
	}
}