import { TSML } from "../../src/TSML";

// debugger;

const compiledTemplate = TSML.compile(`
%h1 Hello World.
`);

console.log(compiledTemplate);
