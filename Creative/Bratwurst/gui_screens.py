import sys
import shutil
import datetime

from gui import GUI
from console import Console
from database import Database, Statistic
from price_calculator import PriceCalculator


class Screens:
    class Calculator:
        @staticmethod
        def ensure_settings(menu):
            while True:
                if not Database.settings.BREAD_PRICE.is_set():
                    Console.Messages.missing_setting("Bread price")
                    menu.show_dialog(Screens.PriceSettings())
                    continue

                if not Database.settings.SAUSAGE_PRICE.is_set():
                    Console.Messages.missing_setting("Sausage price")
                    menu.show_dialog(Screens.PriceSettings())
                    continue
                break

        @staticmethod
        def draw(menu):
            while True:
                Console.Output.header("Bratwurst Calculator!")
                print("NOTE: To return to the menu enter '-1'\n")

                Screens.Calculator.ensure_settings(menu)

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
                Console.PrettyPrint.currency(price)

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

                    Console.PrettyPrint.currency(return_money)

                    Console.Output.header("RETURN MONEY FORMAT")

                    money_size_format = PriceCalculator.get_money_sizes(
                        return_money
                    )

                    if not money_size_format:
                        Console.PrettyPrint.dict(money_size_format)
                    else:
                        print("None :)")

                    try:
                        Database.statistics.publish(Statistic(
                            datetime.datetime.now(),
                            bread_count,
                            sausage_count,
                            price,
                            given
                        ))
                        print("\nSaved statistic to database! :)")
                    except Exception as e:
                        print("\nFailed to save to the Database...")
                        print("--- Error info ---")
                        print(type(e))
                        print(e)
                        print("--- END ERROR INFO ---\n")

                    reenter_given_prompt = Console.Input.safe_string(
                        "... Continue..."
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
                options = [
                    "Exit",
                    "Reset to Defaults",
                    "Nuke Database",
                    "Change Prices"
                ]

                options_box = GUI.Dialogs.OptionsBox(
                    "Choose a Setting you want to change",
                    options
                )

                print("Statistics DB path: " + Database.statistics.file_path)
                print("Settings DB path: " + Database.settings_db.file_path)

                menu.show_dialog(options_box)

                chosen = options_box.get_chosen()

                if chosen == options[0]:
                    break
                elif chosen == options[1]:
                    Database.settings_db.set_defaults()
                    continue
                elif chosen == options[2]:
                    shutil.rmtree("./db")
                    Database.reload()
                    print("Nuked!")
                    continue
                elif chosen == options[3]:
                    menu.show_dialog(Screens.PriceSettings())
                    continue

    class PriceSettings:
        @staticmethod
        def draw(menu):
            while True:
                settings = {
                    "Bread price": {
                        "getter": (lambda: Database.settings.BREAD_PRICE.get(default="None")),
                        "setter": (lambda x: Database.settings.BREAD_PRICE.set(x)),
                        "input_fn": Console.Input.safe_float
                    },
                    "Sausage price": {
                        "getter": (lambda: Database.settings.SAUSAGE_PRICE.get(default="None")),
                        "setter": (lambda x: Database.settings.SAUSAGE_PRICE.set(x)),
                        "input_fn": Console.Input.safe_float,
                    }
                }

                options_box = GUI.Dialogs.OptionsBox(
                    "What to change?",
                    ["Exit"], [""]
                )

                for key in list(settings.keys()):
                    options_box.options.append(key)
                    options_box.extras.append(
                        " - Current: " + str(settings[key]["getter"]())
                    )

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
            sys.exit()

    class ViewStatistics:
        @staticmethod
        def draw(menu):
            Console.Output.header("Statistics file content")
            for line in Database.statistics.read_all_lines():
                line = line.strip()
                print(line)

    class Router:
        @staticmethod
        def draw(menu):
            screens = {
                "Calculator": Screens.Calculator,
                "Settings": Screens.Options,
                "View Statistics": Screens.ViewStatistics,
                "Exit": Screens.Exit
            }

            options = list(screens.keys())
            options_box = GUI.Dialogs.OptionsBox(
                "Choose a Path!",
                options
            )

            while True:
                menu.show_dialog(options_box)

                current_screen = screens[options_box.get_chosen()]
                menu.show(current_screen)
