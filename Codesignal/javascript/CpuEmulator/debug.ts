import { Emulator } from "./CpuEmulator";

const result = Emulator.run(["INV R41", "ADD R42,R41"], {
	printDebugRegisters: true,
	printDebugInstructions: true
});

console.log(result);
