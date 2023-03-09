using ProtoMine.Core.Client;
using ProtoMine.Core.Protocol.Packets;

var client = new MinecraftClient("minecraft.patrickhollweck.de");

await client.Connect();

Console.WriteLine("Connected!");

client.OnPacket += (_, buffer) =>
{
	var packetLength = buffer.ReadVarInt(0);
	var packetId = buffer.ReadVarInt(packetLength.readByteCount);

	Console.WriteLine(
		$"Received Packet! # Length={packetLength.value}, PacketID={packetId.value}"
	);

	Console.WriteLine($"Content={string.Join(",", buffer.ToBytes())}");

	if (packetId.value == 0)
	{
		Console.WriteLine("Status Response Packet:");

		var content = buffer.ReadString(packetLength.readByteCount + packetId.readByteCount);

		Console.WriteLine(
			$"Content-Length={content.Length}, Content={string.Join(",", content)}"
		);
	}

	Console.WriteLine(buffer.ToBytes().ToString());
	Console.WriteLine("\n");
};

var pingRequestPacket = new PingRequestPacket(DateTime.Now.Millisecond);
var statusRequestPacket = new StatusRequestPacket();
var handshakePacket = new HandshakePacket(761, "minecraft.patrickhollweck.de", 25565, 1);

await client.WritePacket(handshakePacket);
await client.WritePacket(statusRequestPacket);
await client.WritePacket(pingRequestPacket);

Console.WriteLine("Packets sent!");
