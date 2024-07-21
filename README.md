# bun-plugin-glob-import

This plugin allows you to import modules using glob patterns.

## Installation

To install the plugin, run:

```sh
bun add -d bun-plugin-glob-import
```

## Usage

To use the plugin, add it to the build options:

```ts
import { globImportPlugin } from 'bun-plugin-glob-import';

await Bun.build({
  plugins: [globImportPlugin()],
});
```

## Example

Suppose you have the following file structure:

```
src/
├── commands
│   ├── special
│   │   ├── list.ts
│   │   └── ping.ts
│   ├── create.ts
│   ├── delete.ts
│   ├── get.ts
│   └── update.ts
└── index.ts
```

### Example Command: `create.ts`

```ts
export default function create() {
  console.log('Created');
}
```

### Importing Files

You can import the files using a glob pattern like this:

```ts
import commands from './commands/**/*.ts';

console.log(commands);
/* => [
  { default: [Function: update] },
  { default: [Function: get] },
  { default: [Function: create] },
  { default: [Function: delete] },
  { default: [Function: list] },
  { default: [Function: ping] },
] */
```

## Type Definitions

To avoid TypeScript errors when importing with a glob pattern, add the types to your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": ["bun-plugin-glob-import/types"]
  }
}
```
