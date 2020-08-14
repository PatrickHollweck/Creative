using System;

namespace StatoBot.Core
{
	public class Timeout
	{
		private DateTime lastAction;
		private readonly TimeSpan timeout;

		public Timeout(TimeSpan timeout)
		{
			lastAction = DateTime.Now;
			this.timeout = timeout;
		}

		public bool IsOver()
		{
			return IsOver(true);
		}

		public bool IsOver(bool reset)
		{
			if (lastAction.Subtract(timeout) > DateTime.Now)
			{
				return false;
			}

			if (reset)
			{
				Reset();
			}

			return true;
		}

		public void Reset()
		{
			lastAction = DateTime.Now;
		}
	}
}
