__author__ = "Patrick Hollweck - patrick-hollweck@gmx.de"

import collections

from gui import GUI
from console import Console

if __name__ == "__main__":
    Console.Output.clear()

    menu = GUI.Managers.Console()
    menu.show(GUI.Screens.Router)
