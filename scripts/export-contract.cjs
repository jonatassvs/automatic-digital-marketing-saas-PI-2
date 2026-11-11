// Run from any directory; Node/TypeScript are needed only when updating the contract.
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const projectRoot = path.resolve(__dirname, '..');
const ts = require(path.join(projectRoot, 'node_modules/typescript'));
const originalResolve = Module._resolveFilename;
Module._resolveFilename = function (name, ...args) {
  return originalResolve.call(this, name.startsWith('@/') ? path.join(projectRoot, name.slice(2)) : name, ...args);
};
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS }
}).outputText, filename);
const { componentSchemas } = require(path.join(projectRoot, 'renderer/schemas/componentSchemas.ts'));
const { GOOGLE_FONTS } = require(path.join(projectRoot, 'renderer/pageDesign.ts'));
const { samplePage } = require(path.join(projectRoot, 'components/editor/samplePage.ts'));
const schemas = Object.fromEntries(Object.entries(componentSchemas).map(([name, schema]) => [name, {
  acceptsChildren: schema.acceptsChildren,
  fields: schema.fields.map(field => Object.fromEntries(['name', 'type', 'required', 'min', 'max', 'options']
    .filter(key => field[key] !== undefined).map(key => [key, key === 'options' ? field.options.map(o => o.value) : field[key]])))
}]));
for (const [file, value] of [
  ['server/validators/component-contract.json', { fonts: GOOGLE_FONTS, schemas }],
  ['tests/fixtures/sample_page.json', samplePage]
]) {
  const target = path.resolve(__dirname, '..', file);
  const content = JSON.stringify(value, null, 2) + '\n';
  if (process.argv.includes('--check')) {
    if (fs.readFileSync(target, 'utf8') !== content) throw new Error(`Contrato desatualizado: ${file}`);
  } else {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content);
  }
}
console.log('Contrato e exemplo da pagina conferidos.');
