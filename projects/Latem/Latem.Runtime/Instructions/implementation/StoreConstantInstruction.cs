using Latem.Runtime.Memory.References;

namespace Latem.Runtime.Instructions.Implementation
{
    public class StoreConstantInstruction : IInstruction
    {
        private readonly MemoryAddress _address;
        private readonly bool _value;

        public StoreConstantInstruction(MemoryAddress address, bool value)
        {
            _address = address;
            _value = value;
        }

        public void Execute(MachineState machine)
        {
            machine.Memory.write(_address, _value);
            machine.Instructions.IncrementInstructionPointer();
        }
    }
}