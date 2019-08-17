class Console:
    """ Console helpers """

    class Input:
        """ Input helpers """

        @staticmethod
        def safe_string(message):
            latest = input(message)
            if latest in ("", " "):
                return None
            return latest

        @staticmethod
        def safe_int(message, allow_no_input=False):
            return Console.Input._safe_base(message, allow_no_input, int)

        @staticmethod
        def safe_float(message, allow_no_input=False):
            return Console.Input._safe_base(message, allow_no_input, float)

        @staticmethod
        def _safe_base(message, allow_no_input, typefunc):
            while True:
                try:
                    result = input(message)
                    if result == "" and allow_no_input:
                        return None

                    if result == "clear":
                        Console.Output.clear()
                        continue
                    else:
                        return typefunc(result)
                except Exception:
                    print("Invalid input! (" + str(typefunc) + ") expected")
                    continue

    class Format:
        """ Formating functions for the console """

        def float(number, decimal_places):
            return ("{0:." + str(decimal_places) + "f}").format(number)

        @staticmethod
        def currency(number):
            return Console.Format.float(number, 2)

    class PrettyPrint:
        """ Use this class for pretty printing commons types """

        @staticmethod
        def float(number, decimal_places):
            print(Console.Format.float(number, decimal_places))

        @staticmethod
        def currency(number):
            return Console.PrettyPrint.float(number, 2)

        @staticmethod
        def key_value(key, value):
            print(str(key).ljust(6) + " -> " + str(value))

        @staticmethod
        def dict(dictionary):
            if not dictionary:
                print("Cannot print empty dict")
                return

            for key in dictionary.keys():
                Console.PrettyPrint.key_value(key, dictionary[key])

    class Output:
        """ Output helpers """

        @staticmethod
        def header(text):
            print("\n--- " + text + " ---\n")

        @staticmethod
        def clear():
            print("\n" * 30)
