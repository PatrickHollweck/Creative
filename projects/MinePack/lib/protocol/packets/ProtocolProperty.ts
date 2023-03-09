/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/ban-types */

import "reflect-metadata";

import { PacketConstructor } from "./Packet.js";
import { ProtocolTypeConstructor } from "../../core/types/base/ProtocolType.js";

export interface ProtocolPropertyMetadata {
	position: number;
	type: ProtocolTypeConstructor;
}

export interface KeyedProtocolPropertyMetadata {
	key: string;
	metadata: ProtocolPropertyMetadata;
}

interface PacketPrototype {
	__protocolProperties__: KeyedProtocolPropertyMetadata[];
}

export function ProtocolProperty<T extends ProtocolTypeConstructor>(
	position: number,
	type: T
): PropertyDecorator {
	return (target: unknown, propertyKey: string | symbol): void => {
		if (typeof target !== "object" || target == null) {
			throw new Error("Decorator must be applied to an object!");
		}

		let props: KeyedProtocolPropertyMetadata[];

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

		props.push({ key: propertyKey, metadata: { position, type } });
	};
}

export function getProtocolProperties(
	classConstructor: PacketConstructor
): KeyedProtocolPropertyMetadata[] {
	const result = [] as KeyedProtocolPropertyMetadata[];

	let prototype = classConstructor.prototype as PacketPrototype | null;

	while (prototype != null) {
		const props = prototype.__protocolProperties__;

		if (Array.isArray(props)) {
			result.push(...props);
		}

		prototype = Object.getPrototypeOf(prototype) as PacketPrototype | null;
	}

	return result;
}
