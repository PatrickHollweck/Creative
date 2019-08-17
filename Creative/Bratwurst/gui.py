from console import Console

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
            def __init__(self, title, options, extras=[]):
                self.title = title
                self.options = options
                self.extras = extras
                self.chosen_option_index = -1

            def draw(self, menu):
                Console.Output.header(self.title)
                for index, option in enumerate(self.options):
                    text = option
                    if len(self.extras) > index:
                        text = str(option) + str(self.extras[index])

                    Console.PrettyPrint.key_value(index, text)

                while True:
                    print()
                    choose_option = Console.Input.safe_int("Chosen a option: ")
                    try:
                        if not self.options[choose_option] is None:
                            self.chosen_option_index = choose_option
                            break
                    except Exception:
                        print("Invalid Input - Option is not in range")

            def get_chosen_index(self):
                return self.chosen_option_index

            def get_chosen(self):
                return self.options[self.chosen_option_index]


GLOBAL_MENU = GUI.Managers.Console()
