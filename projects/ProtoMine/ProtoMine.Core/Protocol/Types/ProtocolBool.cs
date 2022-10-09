namespace ProtoMine.Core.Protocol.Types;

public class ProtocolBool : IProtocolType<bool>
{
	public void Write(PacketBuffer buffer, bool value)
	{
		buffer.WriteBool(value);
	}

	public bool Read(PacketBuffer buffer, int position)
	{
		return buffer.ReadBool(position);
	}
}