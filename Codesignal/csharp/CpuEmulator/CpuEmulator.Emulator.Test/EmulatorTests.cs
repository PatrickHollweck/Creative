using Xunit;

namespace CpuEmulator.Emulator.Test
{
	public class EmulatorTests
	{
		[Fact]
		public void ShouldRun_Instructions_1()
		{
			var result = Emulator.Run(new string[]
			{
				"MOV 5,R00",
				"MOV 10,R01",
				"JZ 7",
				"ADD R02,R01",
				"DEC R00",
				"JMP 3",
				"MOV R02,R42"
			});

			Assert.Equal("50", result.ToString());
		}

		[Fact]
		public void ShouldRun_Instructions_2()
		{
			var result = Emulator.Run(new string[]
			{
				"MOV 32,R00",
				"MOV 1,R41",
				"JZ 8",
				"MOV R41,R42",
				"ADD R41,R42",
				"DEC R00",
				"JMP 3",
				"NOP"
			});

			Assert.Equal("2147483648", result.ToString());
		}

		[Fact]
		public void ShouldRun_Instructions_3()
		{
			var result = Emulator.Run(new string[]
			{
				"MOV 32,R00",
				"MOV 1,R41",
				"JZ 8",
				"MOV R41,R42",
				"ADD R41,R42",
				"DEC R00",
				"JMP 3",
				"NOP"
			});

			Assert.Equal("0", result.ToString());
		}


		[Fact]
		public void ShouldRun_Instructions_4()
		{
			var result = Emulator.Run(new string[]
			{
				"INV R41",
				"ADD R42,R41"
			});

			Assert.Equal("4294967295", result.ToString());
		}

		[Fact]
		public void ShouldRun_Instructions_5()
		{
			var result = Emulator.Run(new string[]
			{
				"DEC R42",
				"INC R01",
				"ADD R02,R01",
				"ADD R00,R02",
				"ADD R00,R42",
				"JZ 1"
			});

			Assert.Equal("4294967294", result.ToString());
		}

		[Fact]
		public void ShouldRun_Instructions_6()
		{
			var result = Emulator.Run(new string[]
			{
				"MOV 12499,R00",
				"JZ 6",
				"DEC R00",
				"DEC R42",
				"JMP 2",
				"NOP",
				"NOP"
			});

			Assert.Equal("4294954797", result.ToString());
		}
		[Fact]
		public void ShouldRun_Instructions_7()
		{
			var result = Emulator.Run(new string[]
			{
				"DEC R39",
				"DEC R39",
				"MOV R39,R42",
				"DEC R42",
				"MOV 4294967295,R41",
				"ADD R42,R41"
			});

			Assert.Equal("4294967292", result.ToString());
		}
		[Fact]
		public void ShouldRun_Instructions_8()
		{
			var result = Emulator.Run(new string[]
			{
				"INV R42",
				"MOV 101,R00",
				"JZ 13",
				"MOV R00,R08",
				"MOV 100,R00",
				"JZ 10",
				"INC R42",
				"DEC R00",
				"JMP 6",
				"MOV R08,R00",
				"DEC R00",
				"JMP 3",
				"INC R42"
			});

			Assert.Equal("10100", result.ToString());
		}
		[Fact]
		public void ShouldRun_Instructions_9()
		{
			var result = Emulator.Run(new string[]
			{
				"ADD R03,R33"
			});

			Assert.Equal("0", result.ToString());
		}
	}
}
