namespace Latem.Runtime.Memory.References
{
    public class StaticMemoryAddress : MemoryAddress
    {
        private readonly int _value;

        public StaticMemoryAddress(int index)
        {
            _value = index;
        }

        public override int ToMemoryIndex()
        {
            return _value;
        }
    }
}