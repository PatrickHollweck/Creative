namespace ProtoMine.Core.Protocol.Types;

public class ProtocolString : IProtocolType<string>
{
	public void Write(PacketBuffer buffer, string value)
	{
		buffer.WriteString(value);
	}

	public string Read(PacketBuffer buffer, int position)
	{
		return buffer.ReadString(position);
	}
}