using System.Linq;

namespace CpuEmulator.Emulator
{
	public class Memory
	{
		public readonly uint DEFAULT_REGISTER_VALUE = 0;

		protected Register[] Registers;

		public Memory()
		{
			Registers = new Register[Emulator.REGISTER_COUNT];

			foreach (var i in Enumerable.Range(0, Emulator.REGISTER_COUNT))
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