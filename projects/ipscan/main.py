import http.client


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


class IPv4Address:
    def __init__(self, decimalRepresentation: int):
        self.as_decimal = decimalRepresentation

    def to_dotted(self):
        bits = Bits.from_number(self.as_decimal).pad(32).to_array()
        chunked_bits = chunks(bits, 8)
        block_nums = [Bits(chunk).to_decimal() for chunk in chunked_bits]

        return '.'.join([str(x) for x in block_nums])


def ping_webserver(address: IPv4Address, ):
    try:
        connection = http.client.HTTPConnection(address.to_dotted(), timeout=5)
        connection.request("GET", "/")

        response = connection.getresponse()

        print(address.to_dotted(), "is a web-server (", response.status, ")")
    except Exception as error:
        print(address.to_dotted(), "is most likely not a web-server! (", error, ")")


def main():
    for num in range(2899908430, 2 ** 32):
        address = IPv4Address(num)

        ping_webserver(address)


if __name__ == "__main__":
    main()
