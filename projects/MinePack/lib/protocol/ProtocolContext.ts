import { ProtocolState } from "./ProtocolState.js";
import { ProtocolVersion } from "../ProtocolVersion.js";

export class ProtocolContext {
	public readonly state: StateProtocolContext;
	public readonly version: ProtocolVersion;
	public readonly compression: CompressionProtocolContext;

	constructor(version: ProtocolVersion) {
		this.version = version;

		this.state = new StateProtocolContext();
		this.compression = new CompressionProtocolContext();
	}
}

class CompressionProtocolContext {
	private _enabled: boolean;
	private _threshold: number;

	constructor() {
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
		this._enabled = enabled;
	}

	public setThreshold(threshold: number) {
		this._threshold = threshold;
	}
}

class StateProtocolContext {
	private _state: ProtocolState;

	constructor() {
		this._state = ProtocolState.Handshake;
	}

	public get current(): ProtocolState {
		return this._state;
	}

	public update(newState: ProtocolState) {
		this._state = newState;
	}
}
