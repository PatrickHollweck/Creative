import { MinecraftClient } from "../lib/MinecraftClient.js";
import { ProtocolVersion } from "../lib/ProtocolVersion.js";

import { attachDisplayHandlers } from "./util.js";
import { waitForPacket } from "../lib/protocol/packets/util.js";

import * as packets from "../lib/protocol/packets/v761/index.js";

const client = new MinecraftClient(ProtocolVersion.v761);

attachDisplayHandlers(client, true);

const host = "minecraft.patrickhollweck.de";
const port = 25565;

await client.connect(host, port);

const handshakePacket = new packets.HandshakePacket();
handshakePacket.nextState = 2;
handshakePacket.serverPort = port;
handshakePacket.serverAddress = host;
handshakePacket.protocolVersion = 761;

await client.writer.sendPacket(handshakePacket);

const loginPacket = new packets.LoginStartPacket();
loginPacket.name = "Hausmaster";
loginPacket.hasPlayerUUID = false;

await client.writer.sendPacket(loginPacket);

await waitForPacket(client.reader, packets.LoginSuccessPacket);
