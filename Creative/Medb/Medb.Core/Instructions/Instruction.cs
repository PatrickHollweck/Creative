namespace Medb.Core.Instructions
{
	public interface Instruction
	{
		void Parse(string[] tokens);
	}
}