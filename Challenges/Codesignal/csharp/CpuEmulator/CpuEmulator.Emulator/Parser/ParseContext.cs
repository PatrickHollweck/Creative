using System.Numerics;

namespace CpuEmulator.Emulator.Parser
{
	public class ParseContext
	{
		public readonly BigInteger CurrentLineNumber;

		public readonly string Source;

		public ParseContext(BigInteger lineNumber, string source)
		{
			CurrentLineNumber = lineNumber;
			Source = source;
		}
	}
}