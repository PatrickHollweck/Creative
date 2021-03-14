using System;

using Xunit;

using Latem.Runtime.Memory.Storage;

namespace Latem.Tests
{
    public class ArrayMemoryTests
    {
        [Fact]
        public void TestReadWrite()
        {
            var memory = new ArrayMemory(1);

            memory.write(0, true);

            Assert.True(memory.read(0));
        }

        [Fact]
        public void TestReadWriteOutOfBounds()
        {
            var memory = new ArrayMemory(5);

            Assert.Throws<IndexOutOfRangeException>(() => memory.write(6, true));
            Assert.Throws<IndexOutOfRangeException>(() => memory.read(6));
        }
    }
}