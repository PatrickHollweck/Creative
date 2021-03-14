using Latem.Runtime.Memory.References;

namespace Latem.Runtime.Instructions.Implementation
{
    public class GotoConstantInstruction : IInstruction
    {
        private readonly int _targetIndex;

        public GotoConstantInstruction(int targetIndex)
        {
            _targetIndex = targetIndex;
        }

        public void Execute(MachineState machine)
        {
            machine.Instructions.JumpToInstruction(_targetIndex);
        }
    }
}