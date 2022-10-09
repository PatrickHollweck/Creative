namespace ProtoMine.Core.Protocol.Types;

public class ProtocolULong : IProtocolType<ulong>
{
	public void Write(PacketBuffer buffer, ulong value)
	{
		buffer.WriteULong(value);
	}

	public ulong Read(PacketBuffer buffer, int position)
	{
		return buffer.ReadULong(position);
	}
}