const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const root = path.resolve(__dirname, '..');
const inputPath = path.join(root, 'legacy/offline/src/App.jsx');
const outputPath = path.join(root, 'legacy/offline/public/app.js');
const input = fs.readFileSync(inputPath, 'utf8');
const result = ts.transpileModule(input, {
  fileName: inputPath,
  reportDiagnostics: true,
  compilerOptions: {
    jsx: ts.JsxEmit.React,
    target: ts.ScriptTarget.ES2020,
    allowJs: true,
    removeComments: true,
  },
});

const errors = (result.diagnostics || []).filter(
  (diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error,
);
if (errors.length) {
  throw new Error(
    errors.map((error) => ts.flattenDiagnosticMessageText(error.messageText, '\n')).join('\n'),
  );
}

fs.writeFileSync(outputPath, result.outputText);
console.log(`Built offline React app: ${result.outputText.length} bytes`);
