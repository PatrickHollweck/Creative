namespace Latem.Runtime.Instructions
{
    public interface IInstruction
    {
        void Execute(MachineState machine);
    }
}
