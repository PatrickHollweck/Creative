namespace ProtoMine.Core.Protocol.Types;

public class ProtocolSByte : IProtocolType<sbyte>
{
	public void Write(PacketBuffer buffer, sbyte value)
	{
		buffer.WriteSByte(value);
	}

	public sbyte Read(PacketBuffer buffer, int position)
	{
		return buffer.ReadSByte(position);
	}
}