import sys
import ssl
import itertools
import http.client

from threading import Thread


def chunks(target: list, chunk_size: int):
    for i in range(0, len(target), chunk_size):
        yield target[i:i + chunk_size]


class Bits:
    def __init__(self, bits=[]):
        self.bits = bits

    @staticmethod
    def from_number(num: int):
        return Bits(
            [int(x) for x in list(bin(num)[2:])]
        )

    def pad(self, lenght: int):
        while len(self.bits) < lenght:
            self.bits.insert(0, 0)

        return self

    def to_decimal(self):
        out = 0

        for bit in self.to_array():
            out = (out << 1) | bit

        return out

    def to_array(self):
        return self.bits


class WebAddress:
    def __init__(self, ip_decimal: int, port: int = None):
        self.ip_decimal = ip_decimal
        self.port = port

    @staticmethod
    def from_dotted(address: str):
        ip, port = address.split(":")

        ipBlockBits = [Bits.from_number(int(block)).pad(8).to_array()
                       for block in ip.split(".")]

        ipBits = list(itertools.chain(*ipBlockBits))
        ipNumber = Bits(ipBits).to_decimal()

        return WebAddress(ipNumber, port)

    def to_dotted(self):
        bits = Bits.from_number(self.ip_decimal).pad(32).to_array()
        chunked_bits = chunks(bits, 8)
        block_nums = [Bits(chunk).to_decimal() for chunk in chunked_bits]

        ip = '.'.join([str(x) for x in block_nums])

        if self.port is not None:
            return ip + ":" + str(self.port)

        return ip


def ping_webserver(address: WebAddress):
    target = address.to_dotted()
    target_request = f"GET {target} /".ljust(24)

    try:
        if address.port == 80:
            connection = http.client.HTTPConnection(
                target, timeout=5
            )

        if address.port == 443:
            connection = http.client.HTTPSConnection(
                target, timeout=5, context=ssl._create_unverified_context()
            )

        connection.request("GET", "/")
        response = connection.getresponse()

        print(
            f"'{target_request}' success ({str(response.status)}, {response.reason})"
        )
    except Exception as error:
        print(
            f"'{target_request}' failed ({error})"
        )
    finally:
        sys.stdout.flush()


current_ip = WebAddress.from_dotted("150.0.0.0:80").ip_decimal


def process_ips():
    global current_ip

    while current_ip <= 2 ** 32:
        current_ip = current_ip + 1
        ping_webserver(WebAddress(current_ip, 80))


def main():
    threads = []

    for _ in range(50):
        thread = Thread(target=process_ips)
        thread.daemon = True
        threads.append(thread)

    for thread in threads:
        thread.start()

    for thread in threads:
        thread.join()


if __name__ == "__main__":
    main()
