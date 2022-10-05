namespace ProtoMine.Core.Protocol;

public class Buffer
{
	private readonly List<byte> bytes;

	public Buffer()
	{
		bytes = new List<byte>();
	}

	public int Count => bytes.Count;

	#region Write Functions

	private static IEnumerable<byte> ToBigEndian(IEnumerable<byte> bytes)
	{
		if (BitConverter.IsLittleEndian)
		{
			bytes = bytes.Reverse();
		}

		return bytes;
	}

	private void AddBytes(byte[] inBytes, int? offset)
	{
		var convertedBytes = ToBigEndian(inBytes);

		if (offset == null)
		{
			bytes.AddRange(convertedBytes);
		}
		else
		{
			bytes.InsertRange(offset.Value, convertedBytes);
		}
	}

	public void WriteInt8(sbyte value, int? offset = null)
	{
		AddBytes(new[] { (byte)value }, offset);
	}

	public void WriteUInt8(byte value, int? offset = null)
	{
		AddBytes(new[] { value }, offset);
	}

	public void WriteInt16(short value, int? offset = null)
	{
		AddBytes(BitConverter.GetBytes(value), offset);
	}

	public void WriteUInt16(ushort value, int? offset = null)
	{
		AddBytes(BitConverter.GetBytes(value), offset);
	}

	public void WriteInt32(int value, int? offset = null)
	{
		AddBytes(BitConverter.GetBytes(value), offset);
	}

	public void WriteUInt32(uint value, int? offset = null)
	{
		AddBytes(BitConverter.GetBytes(value), offset);
	}

	public void WriteInt64(long value, int? offset = null)
	{
		AddBytes(BitConverter.GetBytes(value), offset);
	}

	public void WriteUInt64(ulong value, int? offset = null)
	{
		AddBytes(BitConverter.GetBytes(value), offset);
	}

	public void WriteFloat16(float value, int? offset = null)
	{
		AddBytes(BitConverter.GetBytes(value), offset);
	}

	public void WriteFloat32(double value, int? offset = null)
	{
		AddBytes(BitConverter.GetBytes(value), offset);
	}

	#endregion

	#region Read Functions

	private byte[] Read(int position, int count)
	{
		var readBytes = bytes.ToArray()[position..(position + count)];

		return BitConverter.IsLittleEndian ? readBytes.Reverse().ToArray() : readBytes;
	}

	public sbyte ReadInt8(int position)
	{
		return (sbyte)Read(position, 1).First();
	}

	public byte ReadUInt8(int position)
	{
		return Read(position, 1).First();
	}

	public short ReadInt16(int position)
	{
		return BitConverter.ToInt16(Read(position, 2));
	}

	public ushort ReadUInt16(int position)
	{
		return BitConverter.ToUInt16(Read(position, 2));
	}

	public int ReadInt32(int position)
	{
		return BitConverter.ToInt32(Read(position, 4));
	}

	public uint ReadUInt32(int position)
	{
		return BitConverter.ToUInt32(Read(position, 4));
	}

	public long ReadInt64(int position)
	{
		return BitConverter.ToInt64(Read(position, 8));
	}

	public ulong ReadUInt64(int position)
	{
		return BitConverter.ToUInt64(Read(position, 8));
	}

	public float ReadFloat16(int position)
	{
		return BitConverter.Int32BitsToSingle(
			ReadInt32(position)
		);
	}

	public double ReadFloat32(int position)
	{
		return BitConverter.Int64BitsToDouble(
			ReadInt64(position)
		);
	}

	#endregion
}