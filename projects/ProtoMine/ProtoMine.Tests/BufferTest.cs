using ProtoMine.Core;
using ProtoMine.Core.Protocol;
using Xunit;

namespace ProtoMine.Tests;

public class BufferTest
{
	[Fact]
	public void ReadWrite_Int8()
	{
		var buffer = new Buffer();

		buffer.WriteInt8(sbyte.MinValue, 0);
		buffer.WriteInt8(-12, 1);
		buffer.WriteInt8(0, 2);
		buffer.WriteInt8(15, 3);
		buffer.WriteInt8(sbyte.MaxValue, 4);

		Assert.Equal(sbyte.MinValue, buffer.ReadInt8(0));
		Assert.Equal(-12, buffer.ReadInt8(1));
		Assert.Equal(0, buffer.ReadInt8(2));
		Assert.Equal(15, buffer.ReadInt8(3));
		Assert.Equal(sbyte.MaxValue, buffer.ReadInt8(4));
	}

	[Fact]
	public void ReadWrite_UInt8()
	{
		var buffer = new Buffer();

		buffer.WriteUInt8(byte.MinValue, 0);
		buffer.WriteUInt8(1, 1);
		buffer.WriteUInt8(15, 2);
		buffer.WriteUInt8(245, 3);
		buffer.WriteUInt8(byte.MaxValue, 4);

		Assert.Equal(byte.MinValue, buffer.ReadUInt8(0));
		Assert.Equal(1, buffer.ReadUInt8(1));
		Assert.Equal(15, buffer.ReadUInt8(2));
		Assert.Equal(245, buffer.ReadUInt8(3));
		Assert.Equal(byte.MaxValue, buffer.ReadUInt8(4));
	}

	[Fact]
	public void ReadWrite_Int16()
	{
		var buffer = new Buffer();
		var typeByteSize = 2;

		buffer.WriteInt16(short.MinValue, 0 * typeByteSize);
		buffer.WriteInt16(0, 1 * typeByteSize);
		buffer.WriteInt16(1, 2 * typeByteSize);
		buffer.WriteInt16(short.MaxValue, 3 * typeByteSize);

		Assert.Equal(short.MinValue, buffer.ReadInt16(0 * typeByteSize));
		Assert.Equal(0, buffer.ReadInt16(1 * typeByteSize));
		Assert.Equal(1, buffer.ReadInt16(2 * typeByteSize));
		Assert.Equal(short.MaxValue, buffer.ReadInt16(3 * typeByteSize));
	}

	[Fact]
	public void ReadWrite_UInt16()
	{
		var buffer = new Buffer();
		var typeByteSize = 2;

		buffer.WriteUInt16(ushort.MinValue, 0 * typeByteSize);
		buffer.WriteUInt16(0, 1 * typeByteSize);
		buffer.WriteUInt16(1, 2 * typeByteSize);
		buffer.WriteUInt16(ushort.MaxValue, 3 * typeByteSize);

		Assert.Equal(ushort.MinValue, buffer.ReadUInt16(0 * typeByteSize));
		Assert.Equal(0, buffer.ReadUInt16(1 * typeByteSize));
		Assert.Equal(1, buffer.ReadUInt16(2 * typeByteSize));
		Assert.Equal(ushort.MaxValue, buffer.ReadUInt16(3 * typeByteSize));
	}

	[Fact]
	public void ReadWrite_Int32()
	{
		var buffer = new Buffer();
		var typeByteSize = 4;

		buffer.WriteInt32(int.MinValue, 0 * typeByteSize);
		buffer.WriteInt32(0, 1 * typeByteSize);
		buffer.WriteInt32(1, 2 * typeByteSize);
		buffer.WriteInt32(int.MaxValue, 3 * typeByteSize);

		Assert.Equal(int.MinValue, buffer.ReadInt32(0 * typeByteSize));
		Assert.Equal(0, buffer.ReadInt32(1 * typeByteSize));
		Assert.Equal(1, buffer.ReadInt32(2 * typeByteSize));
		Assert.Equal(int.MaxValue, buffer.ReadInt32(3 * typeByteSize));
	}

	[Fact]
	public void ReadWrite_UInt32()
	{
		var buffer = new Buffer();
		var typeByteSize = 4;

		buffer.WriteUInt32(uint.MinValue, 0 * typeByteSize);
		buffer.WriteUInt32(0, 1 * typeByteSize);
		buffer.WriteUInt32(1, 2 * typeByteSize);
		buffer.WriteUInt32(uint.MaxValue, 3 * typeByteSize);

		Assert.Equal(uint.MinValue, buffer.ReadUInt32(0 * typeByteSize));
		Assert.Equal((uint)0, buffer.ReadUInt32(1 * typeByteSize));
		Assert.Equal((uint)1, buffer.ReadUInt32(2 * typeByteSize));
		Assert.Equal(uint.MaxValue, buffer.ReadUInt32(3 * typeByteSize));
	}

	[Fact]
	public void ReadWrite_Int64()
	{
		var buffer = new Buffer();
		var typeByteSize = 8;

		buffer.WriteInt64(long.MinValue, 0 * typeByteSize);
		buffer.WriteInt64(0, 1 * typeByteSize);
		buffer.WriteInt64(1, 2 * typeByteSize);
		buffer.WriteInt64(long.MaxValue, 3 * typeByteSize);

		Assert.Equal(long.MinValue, buffer.ReadInt64(0 * typeByteSize));
		Assert.Equal(0, buffer.ReadInt64(1 * typeByteSize));
		Assert.Equal(1, buffer.ReadInt64(2 * typeByteSize));
		Assert.Equal(long.MaxValue, buffer.ReadInt64(3 * typeByteSize));
	}

	[Fact]
	public void ReadWrite_UInt64()
	{
		var buffer = new Buffer();
		var typeByteSize = 8;

		buffer.WriteUInt64(ulong.MinValue, 0 * typeByteSize);
		buffer.WriteUInt64(0, 1 * typeByteSize);
		buffer.WriteUInt64(1, 2 * typeByteSize);
		buffer.WriteUInt64(ulong.MaxValue, 3 * typeByteSize);

		Assert.Equal(ulong.MinValue, buffer.ReadUInt64(0 * typeByteSize));
		Assert.Equal((ulong)0, buffer.ReadUInt64(1 * typeByteSize));
		Assert.Equal((ulong)1, buffer.ReadUInt64(2 * typeByteSize));
		Assert.Equal(ulong.MaxValue, buffer.ReadUInt64(3 * typeByteSize));
	}

	[Fact]
	public void ReadWrite_Float16()
	{
		var buffer = new Buffer();
		var typeByteSize = 4;

		buffer.WriteFloat16(float.MinValue, 0 * typeByteSize);
		buffer.WriteFloat16(0, 1 * typeByteSize);
		buffer.WriteFloat16(1, 2 * typeByteSize);
		buffer.WriteFloat16(float.MaxValue, 3 * typeByteSize);
		buffer.WriteFloat16(1.234f, 4 * typeByteSize);

		Assert.Equal(float.MinValue, buffer.ReadFloat16(0 * typeByteSize));
		Assert.Equal(0, buffer.ReadFloat16(1 * typeByteSize));
		Assert.Equal(1, buffer.ReadFloat16(2 * typeByteSize));
		Assert.Equal(float.MaxValue, buffer.ReadFloat16(3 * typeByteSize));
		Assert.Equal(1.234f, buffer.ReadFloat16(4 * typeByteSize));
	}

	[Fact]
	public void ReadWrite_Float32()
	{
		var buffer = new Buffer();
		var typeByteSize = 8;

		buffer.WriteFloat32(double.MinValue, 0 * typeByteSize);
		buffer.WriteFloat32(0, 1 * typeByteSize);
		buffer.WriteFloat32(1, 2 * typeByteSize);
		buffer.WriteFloat32(double.MaxValue, 3 * typeByteSize);
		buffer.WriteFloat32(1.234, 4 * typeByteSize);

		Assert.Equal(double.MinValue, buffer.ReadFloat32(0 * typeByteSize));
		Assert.Equal(0, buffer.ReadFloat32(1 * typeByteSize));
		Assert.Equal(1, buffer.ReadFloat32(2 * typeByteSize));
		Assert.Equal(double.MaxValue, buffer.ReadFloat32(3 * typeByteSize));
		Assert.Equal(1.234, buffer.ReadFloat32(4 * typeByteSize));
	}
}