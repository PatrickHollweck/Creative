using ProtoMine.Core.Protocol;
using ProtoMine.Core.Protocol.Packets.Base;

namespace ProtoMine.Core.Client;

public class MinecraftClient
{
	private readonly NetworkClient network;

	public MinecraftClient(string host, int port = 25565)
	{
		network = new NetworkClient(host, port);
	}

	public event EventHandler<PacketBuffer>? OnPacket;

	public async Task Connect()
	{
		network.OnChunkReceived += (_, buffer) => OnPacket?.Invoke(this, buffer);

		await network.Connect();
	}

	public async Task WritePacket(Packet packet)
	{
		await network.Stream.WriteAsync(packet.Serialize().ToBytes());
	}
}