using Latem.Runtime.Memory.References;

namespace Latem.Runtime.Memory.Storage
{
    public interface IMemory
    {
        bool read(MemoryAddress address);
        void write(MemoryAddress address, bool value);
    }
}
