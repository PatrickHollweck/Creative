using ProtoMine.Core.Protocol.Packets.Base;
using ProtoMine.Core.Protocol.Types;

namespace ProtoMine.Core.Protocol.Packets;

public class PingRequestPacket : Packet
{
	public override int PacketId => 0x01;

	public PingRequestPacket(int echoData)
	{
		EchoData = echoData;
	}

	[ProtocolProperty(0, typeof(ProtocolLong))]
	public long EchoData { get; }
}