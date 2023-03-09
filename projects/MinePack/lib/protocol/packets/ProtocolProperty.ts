import "reflect-metadata";

import { ProtocolTypeConstructor } from "../../core/types/base/ProtocolType";

export const PROTOCOL_PROPERTY_KEY = Symbol("PROTOCOL_PROPERTY_DECORATOR");

export interface ProtocolPropertyMetadata {
	position: number;
	type: ProtocolTypeConstructor;
}

export function getAllProps(
	// eslint-disable-next-line
	clazz: new (...args: any[]) => any
): { key: string; metadata: ProtocolPropertyMetadata }[] {
	const result = [];

	// eslint-disable-next-line
	let prototype = clazz.prototype;
	while (prototype != null) {
		// eslint-disable-next-line
		let props = prototype["__props__"];

		if (Array.isArray(props)) {
			// eslint-disable-next-line
			result.push(...props);
		}

		// eslint-disable-next-line
		prototype = Object.getPrototypeOf(prototype);
	}

	// eslint-disable-next-line
	return result;
}

export function ProtocolProperty<T extends ProtocolTypeConstructor>(
	position: number,
	type: T
): PropertyDecorator {
	// eslint-disable-next-line
	return (target: any, propertyKey: string | symbol): void => {
		let props: unknown[];

		// eslint-disable-next-line
		if (target.hasOwnProperty("__props__")) {
			// eslint-disable-next-line
			props = target.__props__;
		} else {
			// eslint-disable-next-line
			props = target.__props__ = [];
		}

		const metadata = {
			position,
			type,
		} as ProtocolPropertyMetadata;

		props.push({ key: propertyKey, metadata });
	};
}
