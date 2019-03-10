using System;

namespace CpuEmulator.Emulator.Instructions
{
	public class AddInstruction : Instruction
	{
		/// <summary>
		/// Gets or sets first address of a memory cell that should be added.
		/// The result of the addition is stored in this address.
		/// </summary>
		public RegisterAddress A { get; protected set; }

		/// <summary>
		/// Gets or sets second address of a memory cell that should be added.
		/// </summary>
		public RegisterAddress B { get; protected set; }

		/// <summary>
		/// Constructs a Add Instruction
		/// </summary>
		/// <param name="a">The first address of a memory cell that should be added.</param>
		/// <param name="b">The second address of a memory cell that should be added.</param>
		public AddInstruction(RegisterAddress a, RegisterAddress b)
		{
			A = a;
			B = b;
		}

		/// <summary>
		/// Executes this instruction on a machine.
		/// </summary>
		/// <param name="machine">The machine to execute the instruction on</param>
		/// <returns>The machine after the instruction was applied.</returns>
		public Machine Apply(Machine machine)
		{
			machine.Memory.Write(A, (uint)((machine.Memory.Read(A) + machine.Memory.Read(B)) % Math.Pow(2, 32)));
			machine.NextInstruction();

			return machine;
		}
	}
}