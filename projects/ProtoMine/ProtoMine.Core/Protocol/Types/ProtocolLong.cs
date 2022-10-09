namespace ProtoMine.Core.Protocol.Types;

public class ProtocolLong : IProtocolType<long>
{
	public void Write(PacketBuffer buffer, long value)
	{
		buffer.WriteLong(value);
	}

	public long Read(PacketBuffer buffer, int position)
	{
		return buffer.ReadLong(position);
	}
}