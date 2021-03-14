namespace CpuEmulator.Emulator.Instructions
{
	/// <summary>
	/// A Inverse Instruction performs the logical inversion of all bits of a value.
	/// </summary>
	public class InverseInstruction : Instruction
	{
		/// <summary>
		/// Gets or sets the address of the value that should be inverted.
		/// </summary>
		public RegisterAddress Target { get; protected set; }

		/// <summary>
		/// Constructs a Inverse Instruction
		/// </summary>
		/// <param name="target">The address of the value that should be inverted</param>
		public InverseInstruction(RegisterAddress target)
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
			machine.Memory.Write(Target, ~machine.Memory.Read(Target));
			machine.NextInstruction();

			return machine;
		}
	}
}