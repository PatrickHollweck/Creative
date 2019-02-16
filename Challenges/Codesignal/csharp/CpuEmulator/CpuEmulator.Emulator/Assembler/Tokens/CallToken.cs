namespace CpuEmulator.Emulator.Assembler.Tokens
{
	public class CallToken : Token
	{
		public readonly string LabelName;

		public CallToken(string labelName)
		{
			LabelName = labelName;
		}
	}
}