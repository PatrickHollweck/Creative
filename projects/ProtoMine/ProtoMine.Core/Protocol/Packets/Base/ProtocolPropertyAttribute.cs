using ProtoMine.Core.Protocol.Types;

namespace ProtoMine.Core.Protocol.Packets.Base;

[AttributeUsage(AttributeTargets.Property)]
public class ProtocolPropertyAttribute : Attribute
{
	public readonly int Position;
	public readonly Type ProtocolType;

	public ProtocolPropertyAttribute(int position, Type protocolType)
	{
		Position = position;
		ProtocolType = protocolType;

		if (!ProtocolType.IsAssignableTo(typeof(IProtocolTypeIdentity)))
		{
			throw new Exception($"Given type '{protocolType.FullName}' must implement interface 'IProtocolType'!");
		}
	}
}