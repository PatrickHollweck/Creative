namespace CpuEmulator.Emulator.Assembler.Tokens
{
	public class CallToken : IToken
	{
		public readonly string LabelName;

		public CallToken(string labelName)
		{
			LabelName = labelName;
		}
	}
}