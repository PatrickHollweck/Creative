using System.Reflection;
using ProtoMine.Core.Protocol.Packets;
using ProtoMine.Core.Protocol.Packets.Base;

namespace ProtoMine.Core.Protocol;

public static class PacketFormatter
{
	private static List<Packet> PacketTypes = new()
	{
		new HandshakePacket(),
		new PingRequestPacket(),
		new StatusRequestPacket()
	};

	/// <summary>
	///     Writes the current state of the packet into a Buffer
	/// </summary>
	public static PacketBuffer Serialize<TPacket>(TPacket packet)
		where TPacket : Packet
	{
		var output = new PacketBuffer();
		var properties = FindProtocolProperties(packet);

		foreach (var property in properties)
		{
			var value = property.info.GetValue(packet);

			if (value == null)
			{
				throw new ArgumentNullException(
					$"Cannot serialize a null value to a Packet! (Property: '{property.info.Name}')"
				);
			}

			var attributeProtocolType = property.attribute.ProtocolType;
			var attributeProtocolInst = Activator.CreateInstance(attributeProtocolType);

			attributeProtocolType
				.GetMethod("Write")
				?.Invoke(attributeProtocolInst, new[] { output, value });
		}

		return output;
	}

	/// <summary>
	///     Writes the current state of the packet into a Buffer
	/// </summary>
	private static TPacket Deserialize<TPacket>(PacketBuffer buffer)
		where TPacket : Packet
	{
		var output = new PacketBuffer();
		var properties = FindProtocolProperties(packet);

		foreach (var property in properties)
		{
			var value = property.info.GetValue(packet);

			if (value == null)
			{
				throw new ArgumentNullException(
					$"Cannot serialize a null value to a Packet! (Property: '{property.info.Name}')"
				);
			}

			var attributeProtocolType = property.attribute.ProtocolType;
			var attributeProtocolInst = Activator.CreateInstance(attributeProtocolType);

			attributeProtocolType
				.GetMethod("Write")
				?.Invoke(attributeProtocolInst, new[] { output, value });
		}

		return output;
	}

	private static List<(PropertyInfo info, ProtocolPropertyAttribute attribute)>
		FindProtocolProperties<TPacket>(TPacket packet)
		where TPacket : Packet
	{
		var properties = new List<(PropertyInfo info, ProtocolPropertyAttribute attribute)>();

		var type = packet.GetType();
		var allProperties = type.GetProperties();

		foreach (var property in allProperties)
		{
			var attributes = property.GetCustomAttributes();

			var protocolPropertyAttribute = attributes.FirstOrDefault(
				attribute => attribute is ProtocolPropertyAttribute,
				null
			);

			if (protocolPropertyAttribute != null)
			{
				properties.Add(
					((PropertyInfo info, ProtocolPropertyAttribute attribute))(property,
						protocolPropertyAttribute)
				);
			}
		}

		return properties
			.OrderBy(x => x.attribute.Position)
			.ToList();
	}
}