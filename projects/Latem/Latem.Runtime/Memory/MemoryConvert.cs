using System;
using System.Collections.Generic;

namespace Latem.Runtime.Memory
{
    public class MemoryConvert
    {
        public static bool IntBoolToBit(uint value)
        {
            if (value > 1)
            {
                throw new Exception("Illegal conversion of non 0 or 1 number to bit");
            }

            return value == 1;
        }
        
        public static bool[] UIntToBits(uint value)
        {
            var bits = new List<bool>();
            var current = value;

            while (current != 0)
            {
                var remainder = current % 2;

                bits.Add(
                    IntBoolToBit(remainder)
                );

                current = current / 2;
            }

            return bits.ToArray();
        }
    }
}