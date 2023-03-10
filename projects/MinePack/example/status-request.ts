import { MinecraftClient } from "../lib/MinecraftClient.js";

import { ProtocolState } from "../lib/protocol/ProtocolState.js";
import { ProtocolVersion } from "../lib/ProtocolVersion.js";

import { waitForPacket } from "../lib/protocol/packets/util.js";
import { attachDisplayHandlers } from "./util.js";

import * as packets from "../lib/protocol/packets/v761/index.js";

const client = new MinecraftClient(ProtocolVersion.v761);

const host = "minecraft.patrickhollweck.de";
const port = 25565;

attachDisplayHandlers(client);

await client.connect(host, port);

const handshakePacket = new packets.HandshakePacket();
handshakePacket.nextState = 1;
handshakePacket.serverPort = port;
handshakePacket.serverAddress = host;
handshakePacket.protocolVersion = 761;

await client.writer.sendPacket(handshakePacket);
await client.writer.sendPacket(new packets.StatusRequestPacket());

// TODO: Some packets should automatically update the state!
client.context.state.update(ProtocolState.Status);

await waitForPacket(client.reader, packets.StatusResponsePacket);

const pingRequestPacket = new packets.PingRequestPacket();
pingRequestPacket.payload = Date.now().valueOf();

await client.writer.sendPacket(pingRequestPacket);
