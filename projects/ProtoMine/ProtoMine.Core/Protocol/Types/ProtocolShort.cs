namespace ProtoMine.Core.Protocol.Types;

public class ProtocolShort : IProtocolType<short>
{
	public void Write(PacketBuffer buffer, short value)
	{
		buffer.WriteShort(value);
	}

	public short Read(PacketBuffer buffer, int position)
	{
		return buffer.ReadShort(position);
	}
}