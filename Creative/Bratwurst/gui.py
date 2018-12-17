from console import Console
from price_calculator import PriceCalculator

import collections


class GUI:
    class Managers:
        class Console:
            def show(self, screen):
                Console.Output.clear()
                screen.draw(self)

            def show_dialog(self, screen):
                screen.draw(self)

    class Dialogs:
        class OptionsBox:
            title = "DIALOG TITLE NOT SET!"
            options = []
            choose_option = -1

            def draw(self, menu):
                Console.Output.clear()
                Console.Output.header(self.title)
                for index, option in enumerate(self.options):
                    Console.PrettyPrint.key_value(index, option)
                while True:
                    print()
                    choose_option = Console.Input.safe_int("Choose a option: ")
                    try:
                        if not self.options[choose_option] is None:
                            self.choose_option = choose_option
                            break
                    except Exception:
                        print("Invalid Input - Option is not in range")

            def get_choosen_index(self):
                return self.choose_option

            def get_choosen(self):
                return self.options[self.choose_option]

    class Screens:
        class Calculator:
            @staticmethod
            def draw(menu):
                while True:
                    Console.Output.header("Bratwurst Calculator!")
                    print("NOTE: To return to the menu enter '-1'\n")

                    sausage_count = Console.Input.safe_int(
                        "Sausages Count: ", allow_no_input=True
                    )

                    if sausage_count == -1:
                        break

                    bread_count = Console.Input.safe_int(
                        "Bread Count: ", allow_no_input=True
                    )

                    price = PriceCalculator.get_price(
                        sausage_count, bread_count
                    )

                    Console.Output.header("TOTAL PRICE")
                    Console.PrettyPrint.float(price)

                    while True:
                        given = Console.Input.safe_float(
                            "\nGiven money: ", allow_no_input=True
                        )

                        if given is None:
                            Console.Output.clear()
                            break

                        return_money = PriceCalculator.get_return_money(
                            price, given
                        )

                        Console.Output.header("RETURN MONEY")

                        if return_money < 0:
                            print("WARNING: Not enought money!")

                        Console.PrettyPrint.float(return_money)

                        Console.Output.header("RETURN MONEY FORMAT")

                        money_size_format = PriceCalculator.get_money_sizes(
                            return_money
                        )

                        Console.PrettyPrint.dict(money_size_format)

                        reenter_given_prompt = Console.Input.safe_string(
                            "\n... Continue..."
                        )

                        if reenter_given_prompt is not None:
                            continue
                        else:
                            Console.Output.clear()
                            break

        class Options:
            @staticmethod
            def draw(menu):
                Console.Output.header("Options")

                while True:
                    options_box = GUI.Dialogs.OptionsBox()
                    options_box.title = "Choose a Setting you want to change"
                    options_box.options = [
                        "Bread price", "Sausage price", "Exit"]
                    menu.showDialog(options_box)

                    if options_box.get_choosen() == "Exit":
                        break

                    setting = {
                        "Bread price": {
                            "setter": (lambda x: setattr(PriceCalculator, "BREAD_PRICE", x)),
                            "input_fn": Console.Input.safe_float
                        },
                        "Sausage price": {
                            "setter": (lambda x: setattr(PriceCalculator, "SAUSAGE_PRICE", x)),
                            "input_fn": Console.Input.safe_float,
                        }
                    }[options_box.get_choosen()]

                    setting["setter"](
                        setting["input_fn"]("Enter the new value: ")
                    )

        class Router:
            @staticmethod
            def draw(menu):
                Console.Output.header("Options")
                options_box = GUI.Dialogs.OptionsBox()
                options_box.options = ["Calculator", "Options"]
                options_box.title = "Choose a Path"

                while True:
                    menu.show_dialog(options_box)

                    current_screen = {
                        "Calculator": GUI.Screens.Calculator,
                        "Options": GUI.Screens.Options
                    }[options_box.get_choosen()]

                    menu.show(current_screen)
