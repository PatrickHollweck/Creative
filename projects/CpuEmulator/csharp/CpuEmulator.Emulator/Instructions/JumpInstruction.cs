namespace CpuEmulator.Emulator.Instructions
{
	/// <summary>
	/// A jump instruction simply causes the current program to jump to another instruction
	/// </summary>
	public class JumpInstruction : Instruction
	{
		/// <summary>
		/// Gets or sets the address that contains the value that should be jumped to.
		/// </summary>
		public RegisterAddress Target { get; protected set; }

		/// <summary>
		/// Constructs a Jump Instruction
		/// </summary>
		/// <param name="target">The address of the index that should be jumped to.</param>
		public JumpInstruction(RegisterAddress target)
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
			machine.JumpToInstruction(Target.GetIndex() - 1);

			return machine;
		}
	}
}