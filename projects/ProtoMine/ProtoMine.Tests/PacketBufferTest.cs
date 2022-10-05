using ProtoMine.Core;
using ProtoMine.Core.Protocol;
using Xunit;

namespace ProtoMine.Tests;

public class PacketBufferTest
{
	[Theory]
	[InlineData("")]
	[InlineData("	")]
	[InlineData("localhost")]
	[InlineData("Hello World!")]
	[InlineData("This is a short sentence")]
	[InlineData("https://google.com/search?q=minecraft")]
	public void ReadWrite_String(string testString)
	{
		var buffer = new PacketBuffer();

		buffer.WriteString(testString);

		Assert.Equal(testString, buffer.ReadString(0));
	}
}