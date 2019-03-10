using System;

namespace CpuEmulator.Emulator
{
	/// <summary>
	/// A representation of a Address in memory
	/// </summary>
	public class RegisterAddress
	{
		/// <summary>
		/// The index of where the value is stored.
		/// </summary>
		protected int Index { get; set; }

		/// <summary>
		/// Constructs a Register address at the specified index.
		/// </summary>
		/// <param name="index">The index of where the value is stored</param>
		protected RegisterAddress(int index)
		{
			Index = index;
		}

		/// <summary>
		/// Gets the index of the value.
		/// </summary>
		/// <returns>The index of where the value is stored.</returns>
		public int GetIndex()
		{
			return Index;
		}

		/// <summary>
		/// Constructs a Address from a string.
		/// </summary>
		/// <param name="address">The value to construct the address from</param>
		/// <returns>The constructed address</returns>
		public static RegisterAddress FromString(string address)
		{
			address = address.Remove(0, 1);
			if (int.TryParse(address, out int parsedAddress))
			{
				return new RegisterAddress(parsedAddress);
			}

			throw new Exception($"Malformed Register! '{address}' is not a valid register name");
		}

		/// <summary>
		/// Constructs a Address from a number.
		/// </summary>
		/// <param name="index">The index of the location of the value</param>
		/// <returns>The constructed address</returns>
		public static RegisterAddress FromInt(int index)
		{
			return new RegisterAddress(index);
		}

		/// <summary>
		/// Converts a Address to a String - The constructed string is a value register address.
		/// </summary>
		/// <returns>
		/// The address in string form.
		/// </returns>
		public override string ToString()
		{
			return "R" + Index;
		}
	}
}