from database import Database

import collections


class PriceCalculator:
    """ Class to calculate all sort of bratwurst Stuff! """
    SIZES = [
        0.010,
        0.020,
        0.050,
        0.10,
        0.20,
        0.5,
        1.0,
        2.0,
        5.0,
        10.0,
        20.0,
        50.0,
        100.0,
        200.0,
        500.0
    ]

    @staticmethod
    def get_price(sausage_count, bread_count):
        sausage_price = Database.settings.SAUSAGE_PRICE.get()
        bread_price = Database.settings.BREAD_PRICE.get()

        if sausage_count is None or sausage_count < 0:
            sausage_count = 0

        if bread_count is None or bread_count < 0:
            bread_count = 0

        sausage_price = sausage_count * sausage_price
        bread_price = bread_count * bread_price

        return sausage_price + bread_price

    @staticmethod
    def get_return_money(price, given):
        return given - price

    @staticmethod
    def get_money_sizes(money):
        result = collections.OrderedDict()
        for size in reversed(PriceCalculator.SIZES):
            outcome = money / size
            if int(outcome) > 0:
                result[size] = int(outcome)
                money %= size
        return result
