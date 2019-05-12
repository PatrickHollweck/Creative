using System.Linq;

namespace Challenges
{
    public class StringRepeat
    {
        public static string repeatStr(int n, string s)
        {
            return System.Linq.Enumerable.Range(0, 6).Aggregate("", (acc, _) => acc += s);
        }
    }
}