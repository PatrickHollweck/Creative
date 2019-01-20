using BenchmarkDotNet.Attributes;
using BenchmarkDotNet.Running;

namespace CpuEmulator.Benchmark
{
	public static class Program
	{
		public static void Main()
		{
			BenchmarkRunner.Run<CpuEmulatorBenchmark>();
		}
	}

	public class CpuEmulatorBenchmark
	{
		[Benchmark]
		public void Default()
		{
			Emulator.Emulator.Run(
				new string[]
				{
					"MOV 32,R00",
					"MOV 1,R41",
					"JZ 8",
					"MOV R41,R42",
					"ADD R41,R42",
					"DEC R00",
					"JMP 3",
					"NOP"
				}
			);
		}
	}
}
