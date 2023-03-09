const path = require("path");

module.exports = {
	root: true,
	parser: "@typescript-eslint/parser",
	plugins: ["@typescript-eslint", "import"],
	env: {
		node: true,
	},
	overrides: [
		{
			files: ["*.ts"],
			parserOptions: {
				tsconfigRootDir: __dirname,
				project: ["./tsconfig.json"],
			},
			extends: [
				"eslint:recommended",
				"plugin:import/recommended",
				"plugin:import/typescript",
				"plugin:@typescript-eslint/recommended",
				"plugin:@typescript-eslint/recommended-requiring-type-checking",
				"plugin:@typescript-eslint/strict",
				"prettier",
			],
			rules: {
				"import/no-cycle": 2,
				"@typescript-eslint/no-extraneous-class": 0,
				"@typescript-eslint/consistent-type-definitions": 0,
			},
			settings: {
				"import/resolver": {
					node: true,
					typescript: {
						project: "tsconfig.json",
					},
				},
			},
		},
	],
};
