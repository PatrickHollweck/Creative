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

		public static bool IsRegister(string value)
		{
			return value.StartsWith("R") && uint.TryParse(value.Remove(0, 1), out uint _);
		}
	}
}