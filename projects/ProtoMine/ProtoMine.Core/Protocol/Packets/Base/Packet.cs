namespace ProtoMine.Core.Protocol.Packets.Base;

public abstract class Packet
{
	/// <summary>
	///     The ID that defines of which type the content is
	/// </summary>
	public abstract int PacketId { get; }

	public PacketBuffer Serialize()
	{
		var contentBytes = PacketFormatter.Serialize(this);

		// Construct the final packet
		var packet = new PacketBuffer();
		var convertedPacketId = LimitedLEB128.ToVarInt(PacketId);

		// Write packet length
		packet.WriteVarInt(convertedPacketId.Length + contentBytes.Length);

		// Write Packet-ID
		packet.WriteAllBytes(convertedPacketId);

		// Write Content
		packet.WriteAllBytes(contentBytes.ReadBytes(0, contentBytes.Length));

		return packet;
	}
}