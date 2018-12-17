using System;
using System.Numerics;

namespace CpuEmulator.Emulator.Exceptions
{
	public class RegisterOutOfRangeException : Exception
	{
		public BigInteger Index;

		public RegisterOutOfRangeException(BigInteger index)
		{
			Index = index;
		}

		public override string ToString()
		{
			return $"Specified Register: '{Index}' is not in range! Valid range is between 0 and {Emulator.REGISTER_COUNT}";
		}
	}
}