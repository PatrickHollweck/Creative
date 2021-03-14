from gui import GUI, GLOBAL_MENU
from console import Console

import os
import sys
import json


class FileStore:
    def __init__(self, file_name):
        self.file_folder = os.path.join(os.getcwd(), "db")
        self.file_name = file_name
        self.file_path = os.path.join(self.file_folder, self.file_name)
        self.ensure_file()

    def ensure_file(self):
        if not os.path.exists(self.file_path):
            if not os.path.exists(self.file_folder):
                os.mkdir(self.file_folder)

            with open(self.file_path, "w") as f:
                default_content = ""
                if hasattr(self, "create_structure"):
                    default_content = self.create_structure()
                f.write(default_content)
                return True
        return False

    def remove_persistent_store(self):
        os.remove(self.file_path)

    def append(self, content):
        self.ensure_file()
        with open(self.file_path, "a") as f:
            f.write("\n" + content)

    def read_all_lines(self):
        self.ensure_file()
        with open(self.file_path, "r") as f:
            return f.readlines()


class FileDatabase(FileStore):
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

    def handle_access_error(self, e):
        Console.Messages.error(
            "Failed to access database", category="DB", exception=e
        )

        options_menu = GUI.Dialogs.OptionsBox(
            "How to resolve?",
            ["Delete file", "Reseed with defaults", "Exit"]
        )

        GLOBAL_MENU.show_dialog(options_menu)

        index = options_menu.get_chosen_index()
        if index == 0:
            self.remove_persistent_store()
            self.reload()
        elif index == 1:
            if hasattr(self, "set_defaults"):
                Database.settings_db.set_defaults()
            else:
                print("Action can not be executed on this damaged db.")
        elif index == 2:
            sys.exit()
        else:
            print("Unknown option! Exiting...")
            sys.exit()

    def reload(self, is_retry=False):
        try:
            self.ensure_file()
            with open(self.file_path, "r") as json_file:
                try:
                    self.memory = json.load(json_file)
                except json.JSONDecodeError:
                    if os.stat(self.file_path).st_size == 0:
                        if not is_retry:
                            self.remove_persistent_store()
                            self.reload(is_retry=True)
                            return
        except Exception as e:
            if not is_retry:
                print("Retrying...")
                self.reload(is_retry=True)
                return

            self.handle_access_error(e)


class Setting:
    def __init__(self, key):
        self.key = key

    def is_set(self):
        return self.get() is not None

    def get(self, default=None):
        return Database.settings_db.get(self.key, default=default)

    def set(self, value):
        return Database.settings_db.set(self.key, value)


class Settings:
    BREAD_PRICE = Setting("BREAD_PRICE")
    SAUSAGE_PRICE = Setting("SAUSAGE_PRICE")


class SettingsDatabase(FileDatabase):
    def __init__(self):
        FileDatabase.__init__(self, "settings.json")

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

    def get(self, key, default=None):
        retrieved = self.memory.get(key)
        if retrieved is None:
            if default is None:
                print("Tried to access invalid settings key: " + key)
                return None
            return default
        return retrieved


class Statistic:
    def __init__(self, time, bread_count, sausage_count, price, given_money):
        self.time = time
        self.bread_count = bread_count
        self.sausage_count = sausage_count
        self.price = Console.Format.currency(price)
        self.given_money = Console.Format.currency(given_money)


class StatisticsDatabase(FileStore):
    def __init__(self):
        FileStore.__init__(self, "statistics")

    def publish(self, statistic):
        self.append(json.dumps(statistic.__dict__, default=str))
        self.fix_first_line()


class Database:
    settings = Settings
    settings_db = SettingsDatabase()
    statistics = StatisticsDatabase()

    @staticmethod
    def reload():
        Database.settings_db.reload()
