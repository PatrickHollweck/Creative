using System.Collections.Generic;

using Latem.Runtime.Instructions;

using Latem.Runtime.Memory.Storage;
using Latem.Runtime.Memory.References;

namespace Latem.Runtime
{
    public class VirtualMachine
    {
        private readonly MachineState _state;

        public VirtualMachine(int memorySize, IReadOnlyCollection<IInstruction> instructions)
        {
            _state = new MachineState(
                new ArrayMemory(memorySize),
                instructions
            );
        }

        public void Execute()
        {
            while (!_state.Instructions.IsDone)
            {
                _state.Instructions.GetCurrentInstruction().Execute(_state);
            }
        }

        public bool GetMemoryValueAt(MemoryAddress address)
        {
            return _state.Memory.read(address);
        }
    }
}
