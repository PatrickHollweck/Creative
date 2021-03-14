using System.Numerics;

namespace Collatz
{
	internal class Collatz
	{
		protected BigInteger Start;

		public Collatz(BigInteger start)
		{
			if (start <= 0)
			{
				throw new System.ArgumentException("The Start number must be above 0!");
			}

			this.Start = start;
		}

		public BigInteger Evaluate()
		{
			var current = Start;
			var steps = 0;

			while (true)
			{
				if (current == 1)
				{
					return steps;
				}

				if (current % 2 == 0)
				{
					current /= 2;
					steps++;
				}
				else
				{
					current = current * 3 + 1;
					steps++;
				}
			}
		}
	}
}
