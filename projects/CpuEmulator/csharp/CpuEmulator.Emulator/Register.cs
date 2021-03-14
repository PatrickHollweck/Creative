namespace CpuEmulator.Emulator
{
	/// <summary>
	/// A Register.
	/// </summary>
	public class Register
	{
		/// <summary>
		/// Gets or sets the address of the Register.
		/// </summary>
		public RegisterAddress Address { get; set; }

		/// <summary>
		/// Gets or sets value of the Register.
		/// </summary>
		public uint Value { get; set; }

		/// <summary>
		/// Constructs a Register.
		/// </summary>
		/// <param name="address">The address of the Register.</param>
		/// <param name="value">The value of the Register</param>
		public Register(RegisterAddress address, uint value)
		{
			Address = address;
			Value = value;
		}

		/// <summary>
		/// Checks if a string is a valid register name
		/// </summary>
		/// <param name="value">The string to test</param>
		/// <returns>True if the string is a value is a valid register name - False otherwise</returns>
		public static bool IsRegister(string value)
		{
			return value.StartsWith("R") && uint.TryParse(value.Remove(0, 1), out _);
		}
	}
}