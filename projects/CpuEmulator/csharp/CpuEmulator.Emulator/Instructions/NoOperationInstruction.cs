namespace CpuEmulator.Emulator.Instructions
{
	/// <summary>
	/// A "NoOp" Instruction does nothing
	/// </summary>
	public class NoOperationInstruction : Instruction
	{
		/// <summary>
		/// Executes this instruction on a machine.
		/// </summary>
		/// <param name="machine">The machine to execute the instruction on</param>
		/// <returns>The machine after the instruction was applied.</returns>
		public Machine Apply(Machine machine)
		{
			machine.NextInstruction();

			return machine;
		}
	}
}