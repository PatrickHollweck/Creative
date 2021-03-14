import copy
import itertools


class Bits:
    def __init__(self, bits):
        self.bits = bits

    def __str__(self):
        return "".join(map(str, self.bits))

    @staticmethod
    def fromDecimal(num: int, length: int):
        bits = []

        while (num != 0):
            remainder = num % 2

            if remainder == 0:
                bits.append(0)
            else:
                bits.append(1)

            num = num / 2

            if remainder > 0:
                num = num - 0.5

        while (len(bits) < length):
            bits.append(0)

        bits.reverse()

        return Bits(bits)

    def toDecimal(self):
        value = 0

        bits = self.bits.copy()
        bits.reverse()

        for index, bit in enumerate(bits):
            if bit == 1:
                if index == 0:
                    value = value + 1
                else:
                    value = value + 2 ** index

        return value


class IPv4Address:
    ADRESS_LENGTH = 32
    SEGMENT_COUNT = 4
    BITS_PER_SEGMENT = int(ADRESS_LENGTH / SEGMENT_COUNT)

    def __init__(self, address, mask):
        self.address = address
        self.mask = mask

    def __repr__(self):
        return "".join([
            "IP-Bits  : " + str(self.address),
            "\n",
            "Mask-Bits: " + str(self.mask),
            "\n"
        ])

    def __str__(self):
        decimalSegments = list(
            [str(segment.toDecimal()) for segment in self.chunkBitsSegments()]
        )

        decimalAddress = ".".join(decimalSegments)

        return decimalAddress + "/" + str(self.prefixLength)

    def chunkBitsSegments(self):
        segments = []

        for i in range(0, IPv4Address.SEGMENT_COUNT):
            segments.append(
                self.address.bits[
                    i*IPv4Address.BITS_PER_SEGMENT:i * IPv4Address.BITS_PER_SEGMENT+IPv4Address.BITS_PER_SEGMENT
                ]
            )

        return list([Bits(segment) for segment in segments])

    def setHostBits(self, bits):
        if (len(bits) != self.hostPartLength):
            raise Exception('Invalid host bits length')

        for index, value in enumerate(bits):
            self.address.bits[self.prefixLength + index] = value

    def setAllHostBits(self, value):
        self.setHostBits([value for _ in range(0, self.hostPartLength)])

    @staticmethod
    def parse(input):
        [address, mask] = input.split("/")

        addressBits = list(map(
            lambda segment: Bits.fromDecimal(
                int(segment), IPv4Address.BITS_PER_SEGMENT
            ).bits,
            address.split(".")
        ))

        mask = int(mask) * "1" + (IPv4Address.ADRESS_LENGTH - int(mask)) * "0"

        return IPv4Address(
            Bits(sum(addressBits, [])),
            Bits([int(char) for char in mask])
        )

    @property
    def prefixLength(self):
        oneBits = list(filter(lambda bit: bit == 1, self.mask.bits))

        return len(oneBits)

    @property
    def hostPartLength(self):
        return IPv4Address.ADRESS_LENGTH - self.prefixLength

    @property
    def subnetAddress(self):
        address = copy.deepcopy(self)
        address.setAllHostBits(0)

        return address

    @property
    def broadcastAddress(self):
        address = copy.deepcopy(self)
        address.setAllHostBits(1)

        return address


def main():
    print(str(IPv4Address.parse("115.35.10.254/30").broadcastAddress))


if __name__ == '__main__':
    main()
