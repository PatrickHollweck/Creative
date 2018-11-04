using System;

namespace CpuEmulator.Emulator
{
	public class RegisterAddress
	{
		protected int Index;

		protected RegisterAddress(int index)
		{
			Index = index;
		}

		public int GetIndex()
		{
			return Index;
		}

		public static RegisterAddress FromString(string address)
		{
			address = address.Remove(0, 1);
			if (int.TryParse(address, out int parsedAddress))
			{
				if (parsedAddress < 0 || parsedAddress > Emulator.REGISTER_COUNT)
				{
					throw new Exception($"Invalid Register name! '{parsedAddress}' is not in the valid address range");
				}

				return new RegisterAddress(parsedAddress);
			}
			else
			{
				throw new Exception($"Malformed Register! '{address}' is not a valid register name");
			}
		}

		public static RegisterAddress FromInt(int index)
		{
			return new RegisterAddress(index);
		}

		public override string ToString()
		{
			return "R" + Index;
		}
	}
}