using System.Net.Sockets;
using ProtoMine.Core.Protocol;

namespace ProtoMine.Core.Client;

public class NetworkClient
{
	public int Port { get; }
	public string Host { get; }
	public NetworkStream Stream;
	public event EventHandler<PacketBuffer>? OnChunkReceived;

	private readonly TcpClient socket;
	private Thread? receiveThread;

	public NetworkClient(string host, int port)
	{
		Port = port;
		Host = host;

		Stream = null!;
		socket = new TcpClient();
	}

	public async Task Connect()
	{
		await socket.ConnectAsync(Host, Port);

		Stream = socket.GetStream();

		receiveThread = new Thread(ReceiveLoop);
		receiveThread.Start();
	}

	private void ReceiveLoop()
	{
		while (true)
		{
			var networkBuffer = new byte[5];
			var initialBytesRead = Stream.Read(networkBuffer, 0, networkBuffer.Length);

			var packet = new PacketBuffer(networkBuffer);
			var packetLength = packet.ReadVarInt(0);

			var remainingPacketByteCount = packetLength.value - initialBytesRead + packetLength.readByteCount;

			while (remainingPacketByteCount > 0)
			{
				networkBuffer = new byte[remainingPacketByteCount];

				var contentBytesRead = Stream.Read(networkBuffer, 0, networkBuffer.Length);

				remainingPacketByteCount -= contentBytesRead;

				packet.WriteAllBytes(networkBuffer.Take(contentBytesRead));
			}

			OnChunkReceived?.Invoke(this, packet);
		}
	}
}