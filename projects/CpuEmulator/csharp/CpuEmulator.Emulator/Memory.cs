using System.Linq;

namespace CpuEmulator.Emulator
{
	/// <summary>
	/// A representation of Memory.
	/// </summary>
	public class Memory
	{
		/// <summary>
		/// The default value of a uninitialized value.
		/// </summary>
		public const uint DEFAULT_REGISTER_VALUE = 0;

		/// <summary>
		/// The size of the Memory
		/// </summary>
		public int Size => Registers.Length;

		/// <summary>
		/// Gets or sets the "Registers" or memory cells
		/// </summary>
		protected Register[] Registers { get; set; }

		/// <summary>
		/// Constructs a memory stick, with the specified size
		/// </summary>
		/// <param name="size">The size of the memory</param>
		public Memory(int size)
		{
			Registers = new Register[size];

			foreach (var i in Enumerable.Range(0, size))
			{
				Registers[i] = new Register(RegisterAddress.FromInt(i), DEFAULT_REGISTER_VALUE);
			}
		}

		/// <summary>
		/// Writes the specifies value to the specified location in memory.
		/// </summary>
		/// <param name="address">The address to write to</param>
		/// <param name="value">The Value to write</param>
		public void Write(RegisterAddress address, uint value)
		{
			Registers[address.GetIndex()].Value = value;
		}

		/// <summary>
		/// Reads a value from the specifies Location.
		/// </summary>
		/// <param name="address">The address to read from</param>
		/// <returns>The value at the address.</returns>
		public uint Read(RegisterAddress address)
		{
			return Registers[address.GetIndex()].Value;
		}
	}
}