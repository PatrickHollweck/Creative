from console import Console
from gui import GUI, GLOBAL_MENU

import os
import sys
import json
import shutil


class FileStore:
    def __init__(self, file_name):
        self.file_folder = "/storage/3663-3138/qpython/projects3/Bratwurst/db/"
        self.file_name = file_name
        self.file_path = os.path.join(self.file_folder, self.file_name)
        self.ensure_file()

    def ensure_file(self):
        if not os.path.exists(self.file_path):
            if not os.path.exists(self.file_folder):
                os.mkdir(self.file_folder)

            temp = open(self.file_path, "x")
            temp.close()
            return True
        return False

    def append(self, content):
        with open(self.file_path, "a") as f:
            f.write("\n" + content)

    def read_all_lines(self):
        with open(self.file_path, "r") as f:
            return f.readlines()


class Database(FileStore):
    def __init__(self, file_name):
        FileStore.__init__(self, file_name)
        self.memory = {}
        self.reload()

    def commit(self, content, raw=False):
        with open(self.file_path, 'w') as outfile:
            if raw:
                outfile.write(content)
            else:
                json.dump(content, outfile, indent=4)
        self.reload()

    def reload(self):
        try:
            if self.ensure_file():
                with open(self.file_path) as f:
                    self.commit(self.create_structure(), raw=True)
            with open(self.file_path, "r") as json_file:
                self.memory = json.load(json_file)
        except Exception as e:
            print("--- DB ERROR ---")
            print(type(e))
            print(e)

            options_menu = GUI.Dialogs.OptionsBox(
                "How to resolve?",
                ["Delete file", "Reseed with defaults", "Exit"]
            )

            GLOBAL_MENU.show_dialog(options_menu)

            index = options_menu.get_chosen_index()
            if index == 0:
                os.remove(self.file_path)
                self.reload()
            elif index == 1:
                if hasattr(self, "set_defaults"):
                    Database.settings_db.set_defaults()
                else:
                    print("Action can not be executed on this damaged db.")
            elif index is 2:
                sys.exit()
            else:
                print("Unknown option! Exiting...")
                sys.exit()

            print("--- END DB ERROR ---")


class Setting:
    def __init__(self, key):
        self.key = key

    def get(self):
        return Database.settings_db.get(self.key)

    def set(self, value):
        return Database.settings_db.set(self.key, value)


class Settings:
    BREAD_PRICE = Setting("BREAD_PRICE")
    SAUSAGE_PRICE = Setting("SAUSAGE_PRICE")


class SettingsDatabase(Database):
    def __init__(self):
        Database.__init__(self, "settings.json")

    def create_structure(self):
        print("DO NOT FORGET TO SET PRICES!")
        return "{}"

    def set_defaults(self):
        Database.settings.BREAD_PRICE.set(0.3)
        Database.settings.SAUSAGE_PRICE.set(1.1)

    def set(self, key, value):
        self.memory[key] = value
        print("DB: Set value for " + str(key) + " to " + str(value))
        self.commit(self.memory)

    def get(self, key):
        retrieved = self.memory.get(key)
        if retrieved == None:
            print("Tried to access invalid settings key: " + key)
        else:
            return retrieved


class Statistic:
    def __init__(self, time, bread_count, sausage_count, price, given_money):
        self.time = time
        self.bread_count = bread_count
        self.sausage_count = sausage_count
        self.price = price
        self.given_money = given_money


class StatisticsDatabase(FileStore):
    def __init__(self):
        FileStore.__init__(self, "./statistics")

    def publish(self, statistic):
        self.append(json.dumps(statistic.__dict__, default=str))


class Database:
    settings = Settings
    settings_db = SettingsDatabase()
    statistics = StatisticsDatabase()

    @staticmethod
    def reload():
        Database.settings_db.reload()
