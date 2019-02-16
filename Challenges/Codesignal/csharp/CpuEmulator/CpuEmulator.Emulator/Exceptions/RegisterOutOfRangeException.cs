using System;
using System.Numerics;

namespace CpuEmulator.Emulator.Exceptions
{
	public class RegisterOutOfRangeException : Exception
	{
		public readonly BigInteger Index;

		public readonly Machine Machine;

		public RegisterOutOfRangeException(BigInteger index, Machine machine)
		{
			Index = index;
			Machine = machine;
		}

		public override string ToString()
		{
			return $"Specified Register: '{Index}' is not in range! Valid range is between 0 and {Machine.Memory.Size}";
		}
	}
}