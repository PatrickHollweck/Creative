namespace ProtoMine.Core.Protocol.Types;

public class ProtocolFloat : IProtocolType<float>
{
	public void Write(PacketBuffer buffer, float value)
	{
		buffer.WriteFloat(value);
	}

	public float Read(PacketBuffer buffer, int position)
	{
		return buffer.ReadFloat(position);
	}
}