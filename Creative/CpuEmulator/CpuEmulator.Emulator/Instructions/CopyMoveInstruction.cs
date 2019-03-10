namespace CpuEmulator.Emulator.Instructions
{
	/// <summary>
	/// A copy move instruction copies a value from one cell to another.
	/// </summary>
	public class CopyMoveInstruction : Instruction
	{
		/// <summary>
		/// Gets or sets the address of a memory cell where the original value is stored.
		/// </summary>
		public RegisterAddress From { get; protected set; }

		/// <summary>
		/// Gets or sets the address of a memory cell where the value should be copied to.
		/// </summary>
		public RegisterAddress To { get; protected set; }

		/// <summary>
		/// Constructs a Copy-Move Instruction.
		/// </summary>
		/// <param name="from">The address from where to copy.</param>
		/// <param name="to">The address to where the value should be copied to.</param>
		public CopyMoveInstruction(RegisterAddress from, RegisterAddress to)
		{
			From = from;
			To = to;
		}

		/// <summary>
		/// Executes this instruction on a machine.
		/// </summary>
		/// <param name="machine">The machine to execute the instruction on</param>
		/// <returns>The machine after the instruction was applied.</returns>
		public Machine Apply(Machine machine)
		{
			machine.Memory.Write(To, machine.Memory.Read(From));
			machine.NextInstruction();

			return machine;
		}
	}
}