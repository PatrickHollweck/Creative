namespace ProtoMine.Core.Protocol;

/// <summary>
///     Implementation of the LEB128 algorithm.
///     It is "limited" in the sense that a given number will be limited to 5 bytes.
/// </summary>
public static class LimitedLEB128
{
	private const int SEGMENT_BITS = 0x7F;
	private const int CONTINUE_BIT = 0x80;

	public static byte[] ToVarInt(int value)
	{
		var bytes = new List<byte>();

		while (true)
		{
			if ((value & ~SEGMENT_BITS) == 0)
			{
				bytes.Add((byte)value);

				return bytes.ToArray();
			}

			bytes.Add((byte)((value & SEGMENT_BITS) | CONTINUE_BIT));

			value >>>= 7;
		}
	}

	public static byte[] ToVarLong(long value)
	{
		var bytes = new List<byte>();

		while (true)
		{
			if ((value & ~(long)SEGMENT_BITS) == 0)
			{
				bytes.Add((byte)value);

				return bytes.ToArray();
			}

			bytes.Add((byte)((value & SEGMENT_BITS) | CONTINUE_BIT));

			value >>>= 7;
		}
	}

	public static (int value, int readByteCount) FromVarInt(IEnumerable<byte> bytes)
	{
		var value = 0;
		var position = 0;
		var bytesRead = 0;
		var byteList = bytes.ToList();

		while (true)
		{
			bytesRead++;
			var currentByte = byteList.First();
			byteList.RemoveAt(0);

			value |= (currentByte & SEGMENT_BITS) << position;

			if ((currentByte & CONTINUE_BIT) == 0)
			{
				break;
			}

			position += 7;

			if (position >= 32)
			{
				throw new IndexOutOfRangeException("VarInt is too big");
			}
		}

		return (value, bytesRead);
	}

	public static (long value, int readByteCount) FromVarLong(IEnumerable<byte> bytes)
	{
		var value = 0L;
		var position = 0;
		var bytesRead = 0;
		var byteList = bytes.ToList();

		while (true)
		{
			bytesRead++;
			var currentByte = byteList.First();
			byteList.RemoveAt(0);

			value |= (long)(currentByte & SEGMENT_BITS) << position;

			if ((currentByte & CONTINUE_BIT) == 0)
			{
				break;
			}

			position += 7;

			if (position >= 64)
			{
				throw new IndexOutOfRangeException("VarLong is too big");
			}
		}

		return (value, bytesRead);
	}
}