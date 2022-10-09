using ProtoMine.Core.Protocol.Packets.Base;

namespace ProtoMine.Core.Protocol.Packets;

public class StatusRequestPacket : Packet
{
	public override int PacketId => 0x00;
}