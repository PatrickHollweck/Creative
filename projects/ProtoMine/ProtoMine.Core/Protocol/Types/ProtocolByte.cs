namespace ProtoMine.Core.Protocol.Types;

public class ProtocolByte : IProtocolType<byte>
{
	public void Write(PacketBuffer buffer, byte value)
	{
		buffer.WriteByte(value);
	}

	public byte Read(PacketBuffer buffer, int position)
	{
		return buffer.ReadByte(position);
	}
}