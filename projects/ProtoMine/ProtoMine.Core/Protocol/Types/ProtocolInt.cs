namespace ProtoMine.Core.Protocol.Types;

public class ProtocolInt : IProtocolType<int>
{
	public void Write(PacketBuffer buffer, int value)
	{
		buffer.WriteInt(value);
	}

	public int Read(PacketBuffer buffer, int position)
	{
		return buffer.ReadInt(position);
	}
}