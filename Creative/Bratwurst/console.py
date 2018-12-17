import collections


class Console:
    """ Console helpers """

    class Input:
        """ Input helpers """

        @staticmethod
        def safe_string(message):
            latest = input(message)
            if latest == "" or latest == " ":
                return None
            else:
                return latest

        @staticmethod
        def safe_int(message, allow_no_input=False):
            return Console.Input.__safe_base(message, allow_no_input, int)

        @staticmethod
        def safe_float(message, allow_no_input=False):
            return Console.Input.__safe_base(message, allow_no_input, float)

        @staticmethod
        def __safe_base(message, allow_no_input, typefunc):
            while True:
                try:
                    result = input(message)
                    if result == "" and allow_no_input:
                        return None
                    elif result == "clear":
                        Console.Output.clear()
                        continue
                    else:
                        return typefunc(result)
                except Exception:
                    print("Invalid input! (" + str(typefunc) + ") expected")
                    continue

    class Format:
        """ Formating functions for the console """

        @staticmethod
        def float(number):
            return "{0:.2f}".format(number)

    class PrettyPrint:
        """ Use this class for pretty printing commons types """

        @staticmethod
        def float(number):
            print(Console.Format.float(number))

        @staticmethod
        def key_value(key, value):
            print(str(key).ljust(6) + " -> " + str(value))

        @staticmethod
        def dict(dictionary):
            if len(dictionary) is 0:
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
