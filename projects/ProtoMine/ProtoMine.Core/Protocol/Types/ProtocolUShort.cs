namespace ProtoMine.Core.Protocol.Types;

public class ProtocolUShort : IProtocolType<ushort>
{
	public void Write(PacketBuffer buffer, ushort value)
	{
		buffer.WriteUShort(value);
	}

	public ushort Read(PacketBuffer buffer, int position)
	{
		return buffer.ReadUShort(position);
	}
}