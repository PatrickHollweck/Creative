using System.Linq;

using Latem.Runtime.Memory.References;

namespace Latem.Runtime.Memory
{
    public class MemoryReader
    {
        public const int SIZE_BYTE = 8;

        private static bool[] Read(MemoryAddress start, MachineState machine, int size)
        {
            var bits = new bool[size];

            foreach (var index in Enumerable.Range(0, size))
            {
                bits[index] = machine.Memory.read(start + index);
            }

            return bits;
        }

        public static bool[] ReadByte(MemoryAddress start, MachineState machine)
        {
            return Read(start, machine, SIZE_BYTE);
        }
    }
}