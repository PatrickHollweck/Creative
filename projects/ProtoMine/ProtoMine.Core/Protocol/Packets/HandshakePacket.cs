using ProtoMine.Core.Protocol.Packets.Base;
using ProtoMine.Core.Protocol.Types;

namespace ProtoMine.Core.Protocol.Packets;

public class HandshakePacket : Packet
{
	public override int PacketId => 0x00;

	public HandshakePacket(
		int protocolVersion,
		string serverAddress,
		ushort serverPort,
		int nextState
	)
	{
		NextState = nextState;
		ServerPort = serverPort;
		ServerAddress = serverAddress;
		ProtocolVersion = protocolVersion;
	}

	[ProtocolProperty(0, typeof(ProtocolInt))]
	public int ProtocolVersion { get; }

	[ProtocolProperty(1, typeof(ProtocolString))]
	public string ServerAddress { get; }

	[ProtocolProperty(2, typeof(ProtocolUShort))]
	public ushort ServerPort { get; }

	[ProtocolProperty(3, typeof(ProtocolVarInt))]
	public int NextState { get; }
}