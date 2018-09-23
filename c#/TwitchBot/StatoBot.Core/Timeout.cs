using System;
using System.Diagnostics;

namespace StatoBot.Core
{
	public class Timeout
	{
		private DateTime lastAction;
		private readonly TimeSpan timeout;

		public Timeout(TimeSpan timeout)
		{
			this.lastAction = DateTime.Now;
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
			this.lastAction = DateTime.Now;
		}
	}
}
