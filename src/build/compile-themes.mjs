import Compiler from './utils/compile.mjs'

const compiler = new Compiler();
compiler.compileVSCode();
compiler.compileIDEA();
compiler.compileITerm2();
console.log("Build complete.");