namespace Latem.Runtime.Memory.References
{
    public abstract class MemoryAddress
    {
        public static implicit operator int(MemoryAddress address) => address.ToMemoryIndex();
        public static implicit operator MemoryAddress(int index) => new StaticMemoryAddress(index);

        public abstract int ToMemoryIndex();
    }
}
