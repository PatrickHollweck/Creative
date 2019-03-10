namespace CpuEmulator.Emulator.Instructions
{
	/// <summary>
	/// A representation of a Instruction that can be executed on a machine.
	/// </summary>
	public interface Instruction
	{
		/// <summary>
		/// Executes this instruction on a machine.
		/// </summary>
		/// <param name="machine">The machine to execute the instruction on</param>
		/// <returns>The machine after the instruction was applied.</returns>
		Machine Apply(Machine machine);
	}
}