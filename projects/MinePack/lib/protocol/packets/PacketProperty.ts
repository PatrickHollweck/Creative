/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/ban-types */

import "reflect-metadata";

import { PacketBuffer } from "../../core/PacketBuffer.js";
import { PacketConstructor } from "./Packet.js";
import { ProtocolTypeConstructor } from "../../core/types/base/ProtocolType.js";

export interface PacketPropertyMetadata {
	position: number;
	type: ProtocolTypeConstructor;
	isOptional: boolean;
}

export interface KeyedPacketPropertyMetadata {
	key: string;
	metadata: PacketPropertyMetadata;
}

interface PacketPrototype {
	__protocolProperties__: KeyedPacketPropertyMetadata[];
}

export function PacketProperty<T extends ProtocolTypeConstructor>(
	position: number,
	type: T
): PropertyDecorator {
	return (target: unknown, propertyKey: string | symbol): void => {
		if (typeof target !== "object" || target == null) {
			throw new Error("Decorator must be applied to an object!");
		}

		let props: KeyedPacketPropertyMetadata[];

		if (
			(target as PacketPrototype).hasOwnProperty("__protocolProperties__")
		) {
			props = (target as PacketPrototype).__protocolProperties__;
		} else {
			props = (target as PacketPrototype).__protocolProperties__ = [];
		}

		if (typeof propertyKey === "symbol") {
			throw new Error(
				`Cannot use a symbol as a ProtocolProperty (found on key: "${propertyKey.toString()}")`
			);
		}

		const instance = new type(PacketBuffer.empty);

		props.push({
			key: propertyKey,
			metadata: {
				// Default overridable properties
				isOptional: false,
				// Type level override
				...instance.provideMetadata(),
				// Non-Overridable properties
				position,
				type,
			},
		});
	};
}

export function getPacketFields(
	classConstructor: new (...args: any[]) => object
): KeyedPacketPropertyMetadata[] {
	const result = [] as KeyedPacketPropertyMetadata[];

	let prototype = classConstructor.prototype as PacketPrototype | null;

	while (prototype != null) {
		const props = prototype.__protocolProperties__;

		if (Array.isArray(props)) {
			result.push(...props);
		}

		prototype = Object.getPrototypeOf(prototype) as PacketPrototype | null;
	}

	return result.sort((a, b) => a.metadata.position - b.metadata.position);
}
