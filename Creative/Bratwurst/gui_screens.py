from gui import GUI
from console import Console
from database import Database
from price_calculator import PriceCalculator


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
                    Console.Output.clear()
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

                    if len(money_size_format) > 0:
                        Console.PrettyPrint.dict(money_size_format)
                    else:
                        print("None :)")

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
            while True:
                settings = {
                    "Bread price": {
                        "getter": (lambda: Database.settings.BREAD_PRICE.get()),
                        "setter": (lambda x: Database.settings.BREAD_PRICE.set(x)),
                        "input_fn": Console.Input.safe_float
                    },
                    "Sausage price": {
                        "getter": (lambda: Database.settings.SAUSAGE_PRICE.get()),
                        "setter": (lambda x: Database.settings.SAUSAGE_PRICE.set(x)),
                        "input_fn": Console.Input.safe_float,
                    }
                }

                options = ["Exit"]
                extras = [""]
                for key in list(settings.keys()):
                    options.append(key)
                    extras.append(
                        " - Current: " + str(settings[key]["getter"]())
                    )

                options_box = GUI.Dialogs.OptionsBox(
                    "Choose a Setting you want to change",
                    options
                )

                options_box.extras = extras
                menu.show_dialog(options_box)

                if options_box.get_chosen() == "Exit":
                    break

                setting = settings[options_box.get_chosen()]

                setting["setter"](
                    setting["input_fn"](
                        "Enter the new value for setting '" +
                        str(options_box.get_chosen()) + "': "
                    )
                )

    class Exit:
        @staticmethod
        def draw(menu):
            import sys
            sys.exit()

    class Router:
        @staticmethod
        def draw(menu):
            options_box = GUI.Dialogs.OptionsBox(
                "Choose a Path!", ["Calculator", "Options", "Exit"])

            while True:
                menu.show_dialog(options_box)

                current_screen = {
                    "Calculator": Screens.Calculator,
                    "Options": Screens.Options,
                    "Exit": Screens.Exit
                }[options_box.get_chosen()]

                menu.show(current_screen)
