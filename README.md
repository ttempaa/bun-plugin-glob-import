# bun-plugin-glob-import

This plugin allows you to import modules using glob patterns.

[![npm](https://img.shields.io/npm/v/bun-plugin-glob-import.svg)](https://www.npmjs.com/package/bun-plugin-glob-import)
[![npm](https://img.shields.io/npm/dt/bun-plugin-glob-import.svg)](https://www.npmjs.com/package/bun-plugin-glob-import)
[![npm](https://img.shields.io/npm/l/bun-plugin-glob-import.svg)](https://www.npmjs.com/package/bun-plugin-glob-import)

## Installation

To install the plugin, run:

```sh
bun add -d bun-plugin-glob-import
```

## Usage

### As a Bundler Plugin

Add the plugin to your build configuration:

```ts
import { globImportPlugin } from 'bun-plugin-glob-import';

await Bun.build({
  plugins: [globImportPlugin()],
});
```

### As a Runtime Plugin

Register the plugin in your bunfig.toml to use it at runtime:

```toml
preload = ["bun-plugin-glob-import/register"]
```

## Example

Imagine a project with the following file structure:

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

Each command file, like `create.ts`, has a default export:

```ts
export default function create() {
  console.log('Created');
}
```

In your `index.ts` file, you can import these modules using a glob pattern. The plugin provides the result in two formats: a simple array or a path-keyed object.

### Import as an Array

Using the default export, you get an array of all imported modules. This is useful when you just need to iterate over them without referencing their original file paths.

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

### Import as an Object

Using the named export `asObject`, you get an object where keys are the relative file paths and values are the modules. This is ideal when you need to map modules back to their source files.

```ts
import { asObject as commands } from './commands/**/*.ts';

console.log(commands);
/* => {
  'commands/update.ts': { default: [Function: update] },
  'commands/get.ts': { default: [Function: get] },
  'commands/create.ts': { default: [Function: create] },
  'commands/delete.ts': { default: [Function: delete] },
  'commands/special/list.ts': { default: [Function: list] },
  'commands/special/ping.ts': { default: [Function: ping] }
} */
```

## Important Note on Import Syntax

The static `import ... from ...` syntax is processed at build time and works perfectly when using the Bun bundler.
For runtime usage (with preload) or for code that should work universally in both environments, you **must** use a dynamic import:

```ts
const { default: commands, asObject } = await import('./commands/**/*.ts');
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
