# bun-plugin-glob-import

This plugin allows you to import modules using glob patterns.

[![npm](https://img.shields.io/npm/v/bun-plugin-glob-import.svg)](https://www.npmjs.com/package/esbuildbun-plugin-glob-import)
[![npm](https://img.shields.io/npm/dt/bun-plugin-glob-import.svg)](https://www.npmjs.com/package/bun-plugin-glob-import)
[![npm](https://img.shields.io/npm/l/bun-plugin-glob-import.svg)](https://www.npmjs.com/package/bun-plugin-glob-import)

## Installation

To install the plugin, run:

```sh
bun add -d bun-plugin-glob-import
```

## Usage

### As a Bundler Plugin

To use the plugin as a bundler plugin, add it to the build options:

```ts
import { globImportPlugin } from 'bun-plugin-glob-import';

await Bun.build({
  plugins: [globImportPlugin()],
});
```

### As a Runtime Plugin

To use the plugin as a runtime plugin, register it in your `bunfig.toml` file:

```toml
preload = [
    "bun-plugin-glob-import/register"
]
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

The following is the code for `create.ts` and other commands follow a similar structure:

```ts
export default function create() {
  console.log('Created');
}
```

You can import files using glob patterns in your `index.ts` file. The way you perform the import depends on whether you are using the plugin as a bundler plugin or a runtime plugin.

```ts
// Only supported when using as a bundler plugin
import commands from './commands/**/*.ts';

// Supported for both runtime and bundler plugin usage
const { default: commands } = await import('./commands/**/*.ts');

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
