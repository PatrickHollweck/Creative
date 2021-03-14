using System;
using System.Numerics;
using System.Threading;

namespace Collatz
{
	public class CollatzRunner
	{
		protected BigInteger Start;
		protected BigInteger End;

		protected object IncrementLock;

		public event Action<BigInteger> OnSolved;

		public CollatzRunner(BigInteger start)
		{
			Start = start;
			End = -1;

			this.IncrementLock = new object();
		}

		public void SetEnd(BigInteger end)
		{
			End = end;
		}

		public void RunSync()
		{
			while (true)
			{
				if (ShouldStopEvaluation())
				{
					break;
				}

				var steps = new Collatz(GetNextStart()).Evaluate();
				InvokeOnSolved(steps);
			}
		}

		public void RunThreaded(int threadCount)
		{
			for (var i = 0; i != threadCount; i++)
			{
				new Thread(RunSync).Start();
			}
		}

		private BigInteger GetNextStart()
		{
			lock (IncrementLock)
			{
				return Start += 1;
			}
		}

		private bool ShouldStopEvaluation()
		{
			return End > 0 && Start >= End;
		}

		private void InvokeOnSolved(BigInteger steps)
		{
			this.OnSolved?.Invoke(steps);
		}
	}
}
