using System.Numerics;

namespace CpuEmulator.Emulator
{
	public class Register
	{
		public RegisterAddress Address;
		public uint Value;

		public Register(RegisterAddress address, uint value)
		{
			Address = address;
			Value = value;
		}
	}
}