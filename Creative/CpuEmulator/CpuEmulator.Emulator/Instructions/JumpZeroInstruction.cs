namespace CpuEmulator.Emulator.Instructions
{
	/// <summary>
	/// A jump zero instruction causes the processor to jump if the value of the 0'th register is 0.
	/// </summary>
	public class JumpZeroInstruction : Instruction
	{
		/// <summary>
		/// Gets or sets the address that contains the index that should be jumped to - if register 0 is 0.
		/// </summary>
		public RegisterAddress Target { get; protected set; }

		/// <summary>
		/// Constructs a Jump-Zero Instruction
		/// </summary>
		/// <param name="target">The address that contains the index to jump to</param>
		public JumpZeroInstruction(RegisterAddress target)
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
			if (machine.Memory.Read(RegisterAddress.FromInt(0)) == 0)
			{
				machine.JumpToInstruction(Target.GetIndex() - 1);
			}
			else
			{
				machine.NextInstruction();
			}

			return machine;
		}
	}
}