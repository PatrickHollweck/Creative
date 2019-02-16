namespace CpuEmulator.Emulator.Instructions
{
	public class CallInstruction : Instruction
	{
		public readonly int JumpIndex;

		public CallInstruction(int jumpIndex)
		{
			JumpIndex = jumpIndex;
		}

		public Machine Apply(Machine machine)
		{
			machine.JumpToInstruction(JumpIndex);
			return machine;
		}
	}
}