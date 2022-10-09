namespace ProtoMine.Core.Protocol.Types;

public class ProtocolVarInt : IProtocolType<int>
{
	public void Write(PacketBuffer buffer, int value)
	{
		buffer.WriteVarInt(value);
	}

	public int Read(PacketBuffer buffer, int position)
	{
		return buffer.ReadVarInt(position).value;
	}
}