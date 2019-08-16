__author__ = "Patrick Hollweck - patrick-hollweck@gmx.de"

import collections

from gui import GUI, GLOBAL_MENU
from gui_screens import Screens

from console import Console


if __name__ == "__main__":
    Console.Output.clear()

    GLOBAL_MENU.show(Screens.Router)
