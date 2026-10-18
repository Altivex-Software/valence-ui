import fs from 'fs';
import path from 'path';

const ngRoot = 'projects/valence-ui/src/lib/components';
const vueRoot = 'packages/valence-ui-vue/src/components';

// Helper to extract @Input() and @Output() from TS files
function parseAngularComponent(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const inputs = [];
  const outputs = [];

  // Match @Input() name: type = val; or @Input({ ... }) set name(val); or input() signal
  const inputRegex = /@Input\s*(?:\([^)]*\))?\s*(?:set\s+)?([a-zA-Z0-9_$]+)(?:\s*(?::|\()([^=;{]+))?/g;
  let match;
  while ((match = inputRegex.exec(content)) !== null) {
    if (match[1] !== 'set') {
      inputs.push({
        name: match[1],
        type: match[2]?.trim() || 'any'
      });
    }
  }

  // Match signal inputs: name = input<type>(default)
  const signalInputRegex = /([a-zA-Z0-9_$]+)\s*=\s*input(?:\.required)?(?:<([^>]+)>)?\(([^)]*)\)/g;
  while ((match = signalInputRegex.exec(content)) !== null) {
    inputs.push({
      name: match[1],
      type: match[2]?.trim() || 'any'
    });
  }

  // Match @Output() name = new EventEmitter<type>(); or output() signal
  const outputRegex = /@Output\s*(?:\([^)]*\))?\s*([a-zA-Z0-9_$]+)/g;
  while ((match = outputRegex.exec(content)) !== null) {
    outputs.push(match[1]);
  }

  const signalOutputRegex = /([a-zA-Z0-9_$]+)\s*=\s*output(?:<([^>]+)>)?\(\)/g;
  while ((match = signalOutputRegex.exec(content)) !== null) {
    outputs.push(match[1]);
  }

  return { inputs, outputs };
}

console.log('Auditing Angular components in:', ngRoot);
const files = [];

function findTsFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findTsFiles(full);
    } else if (entry.name.endsWith('.component.ts') && !entry.name.endsWith('.spec.ts')) {
      files.push(full);
    }
  }
}

findTsFiles(ngRoot);

console.log(`Found ${files.length} Angular component files.`);

const components = files.map(f => {
  const rel = path.relative(ngRoot, f);
  const parsed = parseAngularComponent(f);
  return {
    file: rel,
    inputs: parsed.inputs,
    outputs: parsed.outputs
  };
});

fs.writeFileSync(
  'packages/valence-ui-vue/scripts/ng-components-dump.json',
  JSON.stringify(components, null, 2),
  'utf-8'
);

console.log('Saved dump to packages/valence-ui-vue/scripts/ng-components-dump.json');
