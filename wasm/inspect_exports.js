const fs = require('fs');
const path = require('path');

const wasmPath = path.join(__dirname, 'build/release.wasm');

try {
    const buffer = fs.readFileSync(wasmPath);
    WebAssembly.compile(buffer).then(module => {
        const exports = WebAssembly.Module.exports(module);
        console.log("Exports:");
        exports.forEach(e => console.log(`  ${e.name}`));
    }).catch(err => {
        console.error("Compilation failed:", err);
    });
} catch (err) {
    console.error("Failed to read file:", err);
}
