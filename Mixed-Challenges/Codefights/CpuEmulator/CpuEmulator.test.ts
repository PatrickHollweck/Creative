import { Emulator, InstructionType, Parser, VM, Util } from "./CpuEmulator";

describe("The CpuEmulator", () => {
	describe("The Parser", () => {
		it("should be able to determin the correct instruction type", () => {
			expect(Parser.getInstructionType("INC R02")).toEqual(InstructionType.INC);
			expect(Parser.getInstructionType("MOV 4,R05")).toEqual(InstructionType.STORE_MOV);
			expect(Parser.getInstructionType("MOV R00,R01")).toEqual(InstructionType.COPY_MOV);
		});
	});

	describe("The VM", () => {
		let vm: VM;

		beforeEach(() => {
			vm = new VM();
		});

		it("should be able to get the correct register", () => {
			vm.setRegisterById(1, 42);
			expect(vm.getRegisterByName("R01")).toEqual(42);
		});

		it("should set a register", () => {
			vm.setRegisterById(0, 5);
			expect(vm.getRegisterById(0)).toEqual(5);
		});

		it("should correctly identify if a string is a valid register", () => {
			expect(VM.isRegister("R500")).toEqual(true);
			expect(VM.isRegister("5")).toEqual(false);
			expect(VM.isRegister("X45")).toEqual(false);
		});
	});

	describe("The instructions", () => {
		describe("ADD", () => {
			it("should add two registers and store the result", () => {
				expect(Emulator.run(["MOV 2,R01", "MOV 6,R02", "ADD R01,R02", "MOV R01,R42"])).toEqual(8);
			});
		});

		describe("COPY_MOV", () => {
			it("should copy the value of the first register into the second", () => {
				expect(Emulator.run(["MOV 4,R00", "MOV R00,R42"])).toEqual(4);
			});
		});

		describe("STORE_MOVE", () => {
			it("should store a value in a register", () => {
				expect(Emulator.run(["MOV 42,R42"])).toEqual(42);
			});
		});

		describe("DEC", () => {
			it("should decrement a positive value", () => {
				expect(Emulator.run(["MOV 5,R42", "DEC R42"])).toEqual(4);
			});

			it("should overflow when decrementing zero", () => {
				expect(Emulator.run(["DEC R42"])).toEqual(Math.pow(2, 32) - 1);
			});
		});

		describe("INC", () => {
			it("should increment a positive value", () => {
				expect(Emulator.run(["INC R42"])).toEqual(1);
			});

			it("should overflow when incrementing 2^32 - 1", () => {
				expect(Emulator.run([`MOV ${Math.pow(2, 32) - 1},R42`, "INC R42"])).toEqual(0);
			});
		});

		describe("JMP", () => {
			it("should jump to the specified location in the code", () => {
				expect(Emulator.run(["MOV 5,R00", "DEC R00", "JZ 5", "JMP 2", "MOV 5,R42"])).toEqual(5);
			});
		});

		describe("Misc", () => {
			it("should throw a error when a invalid instruction is given", () => {
				expect(() => Emulator.run(["AXD 445"])).toThrowError();
			});
		});
	});

	/**
	 * All of these sample programs are from the codefights challenge.
	 */
	describe("Program execution", () => {
		it("should run program 1", () => {
			expect(
				Emulator.run([
					"MOV 5,R00",
					"MOV 10,R01",
					"JZ 7",
					"ADD R02,R01",
					"DEC R00",
					"JMP 3",
					"MOV R02,R42"
				])
			).toEqual(50);
		});

		it("should run program 2", () => {
			expect(
				Emulator.run([
					"MOV 32,R00",
					"MOV 1,R41",
					"JZ 8",
					"MOV R41,R42",
					"ADD R41,R42",
					"DEC R00",
					"JMP 3",
					"NOP"
				])
			).toEqual(2147483648);
		});

		it("should run program 3", () => {
			expect(
				Emulator.run([
					"MOV 32,R00",
					"MOV 1,R41",
					"JZ 7",
					"ADD R41,R41",
					"DEC R00",
					"JMP 3",
					"NOP",
					"MOV R41,R42"
				])
			).toEqual(0);
		});

		it("should run program 4", () => {
			expect(Emulator.run(["INV R41", "ADD R42,R41"])).toEqual(4294967295);
		});

		it("should run program 5", () => {
			expect(
				Emulator.run(["DEC R42", "INC R01", "ADD R02,R01", "ADD R00,R02", "ADD R00,R42", "JZ 1"])
			).toEqual(4294967294);
		});

		it("should run program 6", () => {
			expect(
				Emulator.run(["MOV 12499,R00", "JZ 6", "DEC R00", "DEC R42", "JMP 2", "NOP", "NOP"])
			).toEqual(4294954797);
		});

		it("should run program 7", () => {
			expect(
				Emulator.run([
					"DEC R39",
					"DEC R39",
					"MOV R39,R42",
					"DEC R42",
					"MOV 4294967295,R41",
					"ADD R42,R41"
				])
			).toEqual(4294967292);
		});

		it("should run program 8", () => {
			expect(
				Emulator.run([
					"INV R42",
					"MOV 101,R00",
					"JZ 13",
					"MOV R00,R08",
					"MOV 100,R00",
					"JZ 10",
					"INC R42",
					"DEC R00",
					"JMP 6",
					"MOV R08,R00",
					"DEC R00",
					"JMP 3",
					"INC R42"
				])
			).toEqual(10100);
		});

		it("should run program 9", () => {
			expect(Emulator.run(["ADD R03,R33"])).toEqual(0);
		});
	});
});
