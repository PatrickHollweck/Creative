using System.Text;

namespace ProtoMine.Core.Protocol;

public class PacketBuffer
{
	private readonly Buffer buffer;

	public PacketBuffer()
	{
		buffer = new Buffer();
	}

	#region Write Functions

	public PacketBuffer WriteBool(bool value)
	{
		buffer.WriteInt8(value ? (sbyte)1 : (sbyte)0);

		return this;
	}

	public PacketBuffer WriteSByte(sbyte value)
	{
		buffer.WriteInt8(value);

		return this;
	}

	public PacketBuffer WriteByte(byte value)
	{
		buffer.WriteUInt8(value);

		return this;
	}

	public PacketBuffer WriteAllBytes(IEnumerable<byte> bytes)
	{
		foreach (var inByte in bytes)
		{
			WriteByte(inByte);
		}

		return this;
	}

	public PacketBuffer WriteShort(short value)
	{
		buffer.WriteInt16(value);

		return this;
	}

	public PacketBuffer WriteUShort(ushort value)
	{
		buffer.WriteUInt16(value);

		return this;
	}

	public PacketBuffer WriteInt(int value)
	{
		buffer.WriteInt32(value);

		return this;
	}

	public PacketBuffer WriteUInt(uint value)
	{
		buffer.WriteUInt32(value);

		return this;
	}

	public PacketBuffer WriteLong(long value)
	{
		buffer.WriteInt64(value);

		return this;
	}

	public PacketBuffer WriteULong(ulong value)
	{
		buffer.WriteUInt64(value);

		return this;
	}

	public PacketBuffer WriteFloat(float value)
	{
		buffer.WriteFloat16(value);

		return this;
	}

	public PacketBuffer WriteDouble(double value)
	{
		buffer.WriteFloat32(value);

		return this;
	}

	public PacketBuffer WriteVarInt(int value)
	{
		return WriteAllBytes(
			LimitedLEB128.ToVarInt(value)
		);
	}

	public PacketBuffer WriteVarLong(long value)
	{
		return WriteAllBytes(
			LimitedLEB128.ToVarLong(value)
		);
	}

	public PacketBuffer WriteString(string value)
	{
		WriteVarInt(value.Length);

		return WriteAllBytes(
			Encoding.UTF8.GetBytes(value)
		);
	}

	#endregion

	#region Read Functions

	public bool ReadBool(int position)
	{
		return ReadByte(position) != 0;
	}

	public sbyte ReadSByte(int position)
	{
		return buffer.ReadInt8(position);
	}

	public byte ReadByte(int position)
	{
		return buffer.ReadUInt8(position);
	}

	public byte[] ReadBytes(int position, int count)
	{
		var bytes = new List<byte>();

		for (var i = 0; i < count; i++)
		{
			if (position + i < buffer.Count)
			{
				bytes.Add(buffer.ReadUInt8(position + i));
			}
		}

		return bytes.ToArray();
	}

	public short ReadShort(int position)
	{
		return buffer.ReadInt16(position);
	}

	public ushort ReadUShort(int position)
	{
		return buffer.ReadUInt16(position);
	}

	public int ReadInt(int position)
	{
		return buffer.ReadInt32(position);
	}

	public uint ReadUInt(int position)
	{
		return buffer.ReadUInt32(position);
	}

	public long ReadLong(int position)
	{
		return buffer.ReadInt64(position);
	}

	public ulong ReadULong(int position)
	{
		return buffer.ReadUInt64(position);
	}

	public float ReadFloat(int position)
	{
		return buffer.ReadFloat16(position);
	}

	public double ReadDouble(int position)
	{
		return buffer.ReadFloat32(position);
	}

	public (int value, int readByteCount) ReadVarInt(int position)
	{
		return LimitedLEB128.FromVarInt(
			ReadBytes(position, 5)
		);
	}

	public (int value, int readByteCount) ReadVarLong(int position)
	{
		return LimitedLEB128.FromVarInt(
			ReadBytes(position, 10)
		);
	}

	public string ReadString(int position)
	{
		var length = ReadVarInt(position);
		var charBytes = ReadBytes(position + length.readByteCount, length.value);

		return Encoding.UTF8.GetString(charBytes);
	}

	#endregion
}