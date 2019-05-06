// https://www.codewars.com/kata/55f8a9c06c018a0d6e000132/train/csharp

using System;
using System.Text.RegularExpressions;

namespace Challenges
{
    public class RegexValidatePinCodeKata
    {
        public static bool ValidatePin(string pin)
        {
            return new Regex("^([0-9]{4}|[0-9]{6})$").IsMatch(pin);
        }
    }
}
