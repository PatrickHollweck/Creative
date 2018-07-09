export enum InstructionType {
	COPY_MOV = "COPY_MOV",
	STORE_MOV = "STORE_MOV",
	ADD = "ADD",
	DEC = "DEC",
	INC = "INC",
	INV = "INV",
	JMP = "JMP",
	JZ = "JZ",
	NOP = "NOP"
}

export class Instruction {
	constructor(type: InstructionType, args: any[]) {
		this.type = type;
		this.args = args;
	}

	public type: InstructionType;
	public args: any[];
}

export class InstructionSet {
	private instructions: Instruction[];
	private instructionCounter: number;

	constructor(instructions: Instruction[]) {
		this.instructions = instructions;
		this.instructionCounter = 0;
	}

	next() {
		return this.instructions[this.instructionCounter++];
	}

	hasNext() {
		return this.instructions[this.instructionCounter] !== undefined;
	}

	getCurrent() {
		return this.instructions[this.instructionCounter];
	}

	getCurrentCounter() {
		return this.instructionCounter;
	}

	getInstruction(id: number) {
		return this.instructions[id];
	}

	jumpTo(instructionId: number) {
		this.instructionCounter = instructionId - 1;
	}
}

export class VM {
	private registers: number[];

	constructor() {
		this.registers = new Array(43).fill(0);
	}

	read(name: string | number) {
		if (typeof name === "number") {
			return this.getRegisterById(name);
		} else {
			return this.getRegisterByName(name);
		}
	}

	write(name: string | number, value: number) {
		if (typeof name === "number") {
			this.setRegisterById(name, value);
		} else {
			this.setRegisterByName(name, value);
		}
	}

	readAll() {
		return this.registers;
	}

	private setRegisterByName(name: string, value: number) {
		this.registers[this.getRegisterId(name)] = value;
	}

	private setRegisterById(id: number, value: number) {
		this.registers[id] = value;
	}

	private getRegisterByName(name: string) {
		return this.registers[this.getRegisterId(name)];
	}

	private getRegisterById(id: number) {
		return this.registers[id];
	}

	private getRegisterId(name: string | number) {
		if (typeof name === "number") {
			return name;
		} else {
			return Number.parseInt(name.substring(1));
		}
	}

	static isRegister(value: string) {
		return value[0] === "R";
	}
}

export class Parser {
	static parse(instructions: string[]): Instruction[] {
		const operations: Instruction[] = [];
		for (const instruction of instructions) {
			const typeAndArgs = instruction.split(" ");

			if (!typeAndArgs[1]) {
				operations.push(new Instruction(InstructionType.NOP, []));
				continue;
			}

			const args = typeAndArgs[1].split(",");
			const type = this.getInstructionType(instruction);

			operations.push(new Instruction(type, args));
		}

		return operations;
	}

	static getInstructionType(instruction: string): InstructionType {
		const type = instruction.split(" ")[0];
		const args = this.getInstructionArgs(instruction);

		if (type === "MOV") {
			return VM.isRegister(args[0]) ? InstructionType.COPY_MOV : InstructionType.STORE_MOV;
		} else {
			return InstructionType[type];
		}
	}

	static getInstructionArgs(instruction: string) {
		return instruction.split(" ")[1];
	}
}

export interface EmulatorOptions {
	printDebugRegisters: boolean;
	printDebugInstructions: boolean;
}

export interface UserEmulatorOptions {
	printDebugRegisters?: boolean;
	printDebugInstructions?: boolean;
}

export class Emulator {
	private vm: VM;
	private options: EmulatorOptions;
	private instructions: InstructionSet;

	constructor(instructionSet: InstructionSet, userOptions?: UserEmulatorOptions) {
		this.vm = new VM();
		this.instructions = instructionSet;

		if (!userOptions) userOptions = {};
		this.options = {
			printDebugRegisters: userOptions.printDebugRegisters || false,
			printDebugInstructions: userOptions.printDebugInstructions || false
		};
	}

	static run(instructions: string[], options?: UserEmulatorOptions) {
		debugger;
		const emulator = Emulator.make(instructions, options);
		return emulator.evaluateProgram();
	}

	static make(instructions: string[], options?: UserEmulatorOptions) {
		const parsedInstructions = Parser.parse(instructions);
		const instructionSet = new InstructionSet(parsedInstructions);
		return new Emulator(instructionSet, options);
	}

	evaluateProgram() {
		while (this.instructions.hasNext()) {
			this.evaluateInstruction(this.instructions.next());
			this.printDebugInfo();
		}

		return this.vm.read(42);
	}

	// tslint:disable-next-line:cyclomatic-complexity
	evaluateInstruction(instruction: Instruction) {
		switch (instruction.type) {
			case InstructionType.COPY_MOV:
				this.vm.write(instruction.args[1], this.vm.read(instruction.args[0]));
				break;
			case InstructionType.STORE_MOV:
				this.vm.write(instruction.args[1], Number.parseInt(instruction.args[0]));
				break;
			case InstructionType.ADD:
				this.vm.write(
					instruction.args[0],
					(this.vm.read(instruction.args[0]) + this.vm.read(instruction.args[1])) % Math.pow(2, 32)
				);
				break;
			case InstructionType.DEC:
				this.vm.read(instruction.args[0]) - 1 < 0
					? this.vm.write(instruction.args[0], Math.pow(2, 32) - 1)
					: this.vm.write(instruction.args[0], this.vm.read(instruction.args[0]) - 1);
				break;
			case InstructionType.INC:
				this.vm.read(instruction.args[0]) + 1 > Math.pow(2, 32) - 1
					? this.vm.write(instruction.args[0], 0)
					: this.vm.write(instruction.args[0], this.vm.read(instruction.args[0]) + 1);
				break;
			case InstructionType.INV:
				this.vm.write(instruction.args[0], Util.bitInvert(this.vm.read(instruction.args[0])));
				break;
			case InstructionType.JMP:
				this.instructions.jumpTo(Number.parseInt(instruction.args[0]));
				break;
			case InstructionType.JZ:
				if (this.vm.read(0) === 0) {
					this.instructions.jumpTo(instruction.args[0]);
				}
				break;
			case InstructionType.NOP:
				break;
			default:
				throw new Error(`Invalid instruction type: ${instruction.type}`);
		}
	}

	printDebugInfo() {
		if (!this.options.printDebugRegisters && !this.options.printDebugInstructions) {
			return;
		}

		const output: string[] = [];

		if (this.options.printDebugInstructions) {
			const current = this.instructions.getCurrent();
			output.push(
				`Instructions:\n`,
				this.instructions.hasNext() ? `\tCurrent: ${current.type} :: ${current.args}\n` : "",
				`\tHasNext: ${this.instructions.hasNext()}\n`
			);
		}

		if (this.options.printDebugRegisters) {
			output.push(`Registers:\n${this.vm.readAll().map((val, idx) => `\t[${idx}]: ${val}\n`)}`);
		}

		console.log(...output);
	}
}

export class Util {
	// Dirty...
	static bitInvert(num: number) {
		let sMask = "";
		for (
			let nFlag = 0, nShifted = num;
			nFlag < 32;
			// tslint:disable-next-line:no-bitwise
			nFlag++, sMask += String(nShifted >>> 31), nShifted <<= 1
		);

		const binary = sMask;

		let result = "";
		for (const char of binary) {
			result = `${result}${char === "0" ? "1" : "0"}`;
		}

		const invertedNumber = parseInt(result);
		if (invertedNumber > Math.pow(2, 32) - 1) {
			return Math.pow(2, 32) - 1;
		} else {
			return invertedNumber;
		}
	}
}
