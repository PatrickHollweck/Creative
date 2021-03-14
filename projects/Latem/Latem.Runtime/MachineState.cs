using System.Collections.Generic;

using Latem.Runtime.Instructions;
using Latem.Runtime.Memory.Storage;

namespace Latem.Runtime
{
    public class MachineState
    {
        public IMemory Memory { get; private set; }
        public InstructionSet Instructions { get; private set; }

        public MachineState(IMemory memory, IReadOnlyCollection<IInstruction> instructions)
        {
            Memory = memory;
            Instructions = new InstructionSet(instructions);
        }
    }
}