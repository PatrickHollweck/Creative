import { type EventMap } from "typed-emitter";

export type TypedEmitter<Events extends EventMap> =
	import("typed-emitter").default<Events>;
