namespace ProtoMine.Core.Protocol.Types;

public class ProtocolVarLong : IProtocolType<long>
{
	public void Write(PacketBuffer buffer, long value)
	{
		buffer.WriteVarLong(value);
	}

	public long Read(PacketBuffer buffer, int position)
	{
		return buffer.ReadVarLong(position).value;
	}
}