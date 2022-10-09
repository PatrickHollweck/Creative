namespace ProtoMine.Core.Protocol.Types;

public class ProtocolDouble : IProtocolType<double>
{
	public void Write(PacketBuffer buffer, double value)
	{
		buffer.WriteDouble(value);
	}

	public double Read(PacketBuffer buffer, int position)
	{
		return buffer.ReadDouble(position);
	}
}