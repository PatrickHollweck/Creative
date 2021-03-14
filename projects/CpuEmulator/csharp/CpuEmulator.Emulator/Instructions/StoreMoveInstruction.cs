namespace CpuEmulator.Emulator.Instructions
{
	/// <summary>
	/// A Store move instruction.
	/// Stores a literal into a register.
	/// </summary>
	public class StoreMoveInstruction : Instruction
	{
		/// <summary>
		/// Gets or sets the value to store.
		/// </summary>
		public uint Value { get; set; }

		/// <summary>
		/// Gets or sets the address to store the value at.
		/// </summary>
		public RegisterAddress Target { get; set; }

		/// <summary>
		/// Constructs a Store-Move Instruction.
		/// </summary>
		/// <param name="value">The value to be stored.</param>
		/// <param name="target">The address where the value should be stored at.</param>
		public StoreMoveInstruction(uint value, RegisterAddress target)
		{
			Value = value;
			Target = target;
		}

		/// <summary>
		/// Executes this instruction on a machine.
		/// </summary>
		/// <param name="machine">The machine to execute the instruction on</param>
		/// <returns>The machine after the instruction was applied.</returns>
		public Machine Apply(Machine machine)
		{
			machine.Memory.Write(Target, Value);
			machine.NextInstruction();

			return machine;
		}
	}
}