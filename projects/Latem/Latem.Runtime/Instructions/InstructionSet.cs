using System.Linq;
using System.Collections.Generic;

namespace Latem.Runtime.Instructions
{
    public class InstructionSet
    {
        public int InstructionPointer { get; protected set; }
        public IReadOnlyList<IInstruction> Instructions { get; private set;  }

        public bool IsDone => InstructionPointer == Instructions.Count;

        public InstructionSet(IEnumerable<IInstruction> instructions)
        {
            InstructionPointer = 0;
            Instructions = instructions.ToList();
        }

        public void IncrementInstructionPointer()
        {
            InstructionPointer++;
        }

        public void JumpToInstruction(int index)
        {
            InstructionPointer = index;
        }

        public IInstruction GetCurrentInstruction()
        {
            return Instructions[InstructionPointer];
        }
    }
}
