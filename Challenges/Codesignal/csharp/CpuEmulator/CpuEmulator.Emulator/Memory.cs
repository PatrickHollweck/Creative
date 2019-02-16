using System.Linq;

namespace CpuEmulator.Emulator
{
	public class Memory
	{
		public readonly uint DEFAULT_REGISTER_VALUE = 0;

		public int Size => this.Registers.Length;

		protected Register[] Registers;

		public Memory(int size)
		{
			Registers = new Register[size];

			foreach (var i in Enumerable.Range(0, size))
			{
				Registers[i] = new Register(RegisterAddress.FromInt(i), DEFAULT_REGISTER_VALUE);
			}
		}

		public void Write(RegisterAddress address, uint value)
		{
			Registers[address.GetIndex()].Value = value;
		}

		public uint Read(RegisterAddress address)
		{
			return Registers[address.GetIndex()].Value;
		}
	}
}