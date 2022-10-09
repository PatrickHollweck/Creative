namespace ProtoMine.Core.Protocol.Types;

public interface IProtocolTypeIdentity
{
}

public interface IProtocolType<T> : IProtocolTypeIdentity
{
	public void Write(PacketBuffer buffer, T value);
	public T Read(PacketBuffer buffer, int position);
}