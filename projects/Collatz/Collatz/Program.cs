using System;
using System.Threading.Tasks;
using BenchmarkDotNet.Attributes;
using BenchmarkDotNet.Running;

namespace Collatz
{
	public class Benchmarks
	{
		[Benchmark]
		public void ThreadSync() => MakeDefaultRunner().RunSync();

		[Benchmark]
		public void Thread10() => MakeDefaultRunner().RunThreaded(10);

		private static CollatzRunner MakeDefaultRunner()
		{
			var runner = new CollatzRunner(1);
			runner.SetEnd(10_000);

			return runner;
		}
	}

	internal class Program
	{
		private static void Main(string[] args)
		{
			BenchmarkRunner.Run<Benchmarks>();
			Console.Read();
		}
	}
}
