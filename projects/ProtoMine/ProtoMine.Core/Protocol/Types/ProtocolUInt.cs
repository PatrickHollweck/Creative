namespace ProtoMine.Core.Protocol.Types;

public class ProtocolUInt : IProtocolType<uint>
{
	public void Write(PacketBuffer buffer, uint value)
	{
		buffer.WriteUInt(value);
	}

	public uint Read(PacketBuffer buffer, int position)
	{
		return buffer.ReadUInt(position);
	}
}