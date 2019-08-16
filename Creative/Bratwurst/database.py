from gui import GUI, GLOBAL_MENU

import os
import sys
import json


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


class SettingsDatabase:
    def __init__(self):
        self.file_folder = "./db"
        self.file_path = self.file_folder + "/settings.json"
        self.memory = {}
        self.reload()

    def reload(self):
        try:
            if not os.path.exists(self.file_path):
                if not os.path.exists(self.file_folder):
                    os.mkdir("./db")

                with open(self.file_path, "w") as temp:
                    temp.write("{}")

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
            if index is 0:
                os.remove(self.file_path)
                self.reload()
            elif index is 1:
                Database.settings.BREAD_PRICE.set(1)
                Database.settings.SAUSAGE_PRICE.set(0.30)
            elif index is 2:
                sys.exit()
            else:
                print("Unknown option! Exiting...")
                sys.exit()

            print("--- END DB ERROR ---")

    def commit(self):
        with open(self.file_path, 'w') as outfile:
            json.dump(self.memory, outfile)
        self.reload()

    def set(self, key, value):
        self.memory[key] = value
        print("DB: Set value for " + str(key) + " to " + str(value))
        self.commit()

    def get(self, key):
        retrieved = self.memory.get(key)
        if retrieved == None:
            print("Tried to access invalid settings key: " + key)
        else:
            return retrieved


class Database:
    settings = Settings
    settings_db = SettingsDatabase()
