const fs = require('fs');
const path = require('path');

const wasmPath = path.join(__dirname, 'build/release.wasm');

try {
    const buffer = fs.readFileSync(wasmPath);
    WebAssembly.compile(buffer).then(module => {
        const imports = WebAssembly.Module.imports(module);
        console.log("Imports needed:");
        imports.forEach(i => console.log(`  ${i.module}.${i.name}`));
    }).catch(err => {
        console.error("Compilation failed:", err);
    });
} catch (err) {
    console.error("Failed to read file:", err);
}
