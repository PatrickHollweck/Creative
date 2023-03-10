import EventEmitter from "node:events";
import { TypedEmitter } from "../types/TypeEmitter.js";

import { ProtocolState } from "./ProtocolState.js";
import { ProtocolVersion } from "../ProtocolVersion.js";

type Events = {
	change: (key: string, oldValue: any, newValue: any) => void;
};

export class ProtocolContext {
	public readonly state: StateProtocolContext;
	public readonly version: ProtocolVersion;
	public readonly compression: CompressionProtocolContext;

	public readonly events: TypedEmitter<Events>;

	constructor(version: ProtocolVersion) {
		this.version = version;
		this.events = new EventEmitter() as TypedEmitter<Events>;

		this.state = new StateProtocolContext(this);
		this.compression = new CompressionProtocolContext(this);
	}
}

class CompressionProtocolContext {
	private _enabled: boolean;
	private _threshold: number;

	private context: ProtocolContext;

	constructor(context: ProtocolContext) {
		this.context = context;

		this._enabled = false;
		this._threshold = 0;
	}

	public get enabled(): boolean {
		return this._enabled;
	}

	public get threshold(): number {
		return this._threshold;
	}

	public setEnabled(enabled: boolean) {
		this.context.events.emit(
			"change",
			"compression.enabled",
			this._enabled,
			enabled
		);

		this._enabled = enabled;
	}

	public setThreshold(threshold: number) {
		this.context.events.emit(
			"change",
			"compression.threshold",
			this._threshold,
			threshold
		);

		this._threshold = threshold;
	}
}

class StateProtocolContext {
	private _state: ProtocolState;

	private context: ProtocolContext;

	constructor(context: ProtocolContext) {
		this.context = context;

		this._state = ProtocolState.Handshake;
	}

	public get current(): ProtocolState {
		return this._state;
	}

	public update(newState: ProtocolState) {
		this.context.events.emit("change", "state", this._state, newState);

		this._state = newState;
	}
}
