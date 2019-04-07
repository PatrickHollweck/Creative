namespace Medb.Core
{
	public class Database
	{
		public void Execute(string source)
		{
			var instructions = InstructionParser.Parse(source);

			foreach (var instruction in instructions)
			{
				instruction.Execute();
			}
		}
	}
}