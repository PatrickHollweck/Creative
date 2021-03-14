using Latem.Runtime.Memory.References;

namespace Latem.Runtime.Memory.Storage
{
    public class ArrayMemory : IMemory
    {
        private readonly bool[] _buffer;

        public ArrayMemory(int size)
        {
            _buffer = new bool[size];
        }

        public bool read(MemoryAddress address)
        {
            return _buffer[address.ToMemoryIndex()];
        }

        public void write(MemoryAddress address, bool value)
        {
            _buffer[address.ToMemoryIndex()] = value;
        }
    }
}
