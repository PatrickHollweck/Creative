using ProtoMine.Core;
using ProtoMine.Core.Protocol;
using Xunit;

namespace ProtoMine.Tests;

public class LimitedLEB128Test
{
	[Fact]
	public void VarInt()
	{
		var testCases = new[]
		{
			(literal: 0, bytes: new byte[] { 0x00 }),
			(literal: 1, bytes: new byte[] { 0x01 }),
			(literal: 2, bytes: new byte[] { 0x02 }),
			(literal: 127, bytes: new byte[] { 0x7f }),
			(literal: 128, bytes: new byte[] { 0x80, 0x01 }),
			(literal: 255, bytes: new byte[] { 0xff, 0x01 }),
			(literal: 25565, bytes: new byte[] { 0xdd, 0xc7, 0x01 }),
			(literal: 2097151, bytes: new byte[] { 0xff, 0xff, 0x7f }),
			(literal: -1, bytes: new byte[] { 0xff, 0xff, 0xff, 0xff, 0x0f }),
			(literal: 2147483647, bytes: new byte[] { 0xff, 0xff, 0xff, 0xff, 0x07 }),
			(literal: -2147483648, bytes: new byte[] { 0x80, 0x80, 0x80, 0x80, 0x08 })
		};

		foreach (var testCase in testCases)
		{
			Assert.Equal(
				LimitedLEB128.ToVarInt(testCase.literal),
				testCase.bytes
			);

			Assert.Equal(
				LimitedLEB128.FromVarInt(testCase.bytes).value,
				testCase.literal
			);
		}
	}

	[Fact]
	public void VarLong()
	{
		var testCases = new[]
		{
			(literal: 0, bytes: new byte[] { 0x00 }),
			(literal: 1, bytes: new byte[] { 0x01 }),
			(literal: 2, bytes: new byte[] { 0x02 }),
			(literal: 127, bytes: new byte[] { 0x7f }),
			(literal: 128, bytes: new byte[] { 0x80, 0x01 }),
			(literal: 255, bytes: new byte[] { 0xff, 0x01 }),
			(literal: 2147483647, bytes: new byte[] { 0xff, 0xff, 0xff, 0xff, 0x07 }),
			(literal: 9223372036854775807, bytes: new byte[] { 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x7f }),
			(literal: -1, bytes: new byte[] { 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x01 }),
			(literal: -2147483648, bytes: new byte[] { 0x80, 0x80, 0x80, 0x80, 0xf8, 0xff, 0xff, 0xff, 0xff, 0x01 }),
			(literal: -9223372036854775808,
				bytes: new byte[] { 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x01 })
		};

		foreach (var testCase in testCases)
		{
			Assert.Equal(
				LimitedLEB128.ToVarLong(testCase.literal),
				testCase.bytes
			);

			Assert.Equal(
				LimitedLEB128.FromVarLong(testCase.bytes).value,
				testCase.literal
			);
		}
	}
}