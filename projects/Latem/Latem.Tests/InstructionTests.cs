using System.Collections.Generic;

using Xunit;

using Latem.Runtime;
using Latem.Runtime.Instructions;
using Latem.Runtime.Instructions.Implementation;

namespace Latem.Tests
{
    public class InstructionTests
    {
        [Fact]
        public void StoreConstant_ShouldWriteTheValueToMemory()
        {
            var vm = new VirtualMachine(
                5,
                new List<IInstruction> {
                    new StoreConstantInstruction(0, true),
                }
            );

            vm.Execute();

            Assert.True(vm.GetMemoryValueAt(0));
        }

        [Fact]
        public void GotoConstant_ShouldGotoTheSpecifiedInstructionIndex()
        {
            var vm = new VirtualMachine(
                5,
                new List<IInstruction> {
                    new GotoConstantInstruction(2),
                    new StoreConstantInstruction(0, true),
                    new StoreConstantInstruction(1, true)
                }
            );

            vm.Execute();

            Assert.False(vm.GetMemoryValueAt(0));
            Assert.True(vm.GetMemoryValueAt(1));
        }
    }
}
