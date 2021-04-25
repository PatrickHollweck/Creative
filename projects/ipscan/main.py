import sys
import ssl
import argparse
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
        split = address.split(":")
        ip = split[0]
        port = None if len(split) <= 1 else split[1]

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
    target_request = f"GET / {target}".ljust(24)

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


start_ip = 0
end_ip = 0
thread_count = 0


def process_ips():
    global start_ip, end_ip

    while start_ip <= end_ip:
        start_ip = start_ip + 1
        ping_webserver(WebAddress(start_ip - 1, 80))


def start_scan():
    global start_ip, end_ip, thread_count

    print("--- Starting to scan ---")
    print(f"From        : {WebAddress(start_ip).to_dotted()}")
    print(f"To          : {WebAddress(end_ip).to_dotted()}")
    print(f"Thread-Count: {thread_count}")
    print("------------------------")

    threads = []

    for _ in range(thread_count):
        thread = Thread(target=process_ips)
        thread.daemon = True
        threads.append(thread)

    for thread in threads:
        thread.start()

    for thread in threads:
        thread.join()


def main():
    global start_ip, end_ip, thread_count

    parser = argparse.ArgumentParser(description="Python IP-Scanner")

    parser.add_argument("--start", action="store", dest="start", type=str,
                        default=WebAddress.from_dotted("0.0.0.0").ip_decimal,
                        help="The start IP from which to start scanning (default: 0.0.0.0)")

    parser.add_argument("--end", action="store", dest="end", type=str,
                        default=WebAddress.from_dotted(
                            "255.255.255.255").ip_decimal,
                        help="The last IP that should be scanned (default: 255.255.255.255)")

    parser.add_argument("--thread-count", action="store",
                        dest="thread_count", type=int, default=1,
                        help="The amount of thread to use for concurrent scanning (default: 1)")

    args = parser.parse_args()

    end_ip = WebAddress.from_dotted(args.end).ip_decimal
    start_ip = WebAddress.from_dotted(args.start).ip_decimal
    thread_count = args.thread_count

    start_scan()


if __name__ == "__main__":
    main()
