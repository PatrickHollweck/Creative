namespace CpuEmulator.Emulator.Instructions
{
	/// <summary>
	/// A Instruction that calls a subroutine.
	/// </summary>
	public class CallInstruction : Instruction
	{
		/// <summary>
		/// The first instruction of the subroutine.
		/// </summary>
		public readonly int JumpIndex;

		/// <summary>
		/// Constructs a Call instruction
		/// </summary>
		/// <param name="jumpIndex">The first instruction of the subroutine to call</param>
		public CallInstruction(int jumpIndex)
		{
			JumpIndex = jumpIndex;
		}

		/// <summary>
		/// Executes this instruction on a machine.
		/// </summary>
		/// <param name="machine">The machine to execute the instruction on</param>
		/// <returns>The machine after the instruction was applied.</returns>
		public Machine Apply(Machine machine)
		{
			machine.JumpToInstruction(JumpIndex);
			return machine;
		}
	}
}