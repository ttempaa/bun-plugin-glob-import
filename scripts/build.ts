import { $, type BuildConfig } from 'bun';

console.write('Cleaning... ');
await $`rm -rf dist`;
console.log(`Done.`);

const buildOptions: BuildConfig = {
	entrypoints: ['source/index.ts'],
	outdir: 'dist',
	target: 'bun',
};

console.write('Building... ');
const result = await Bun.build(buildOptions);
if (result.success) {
	console.log(`Done.`);
} else {
	console.error('Build failed');
	for (const message of result.logs) {
		console.error(message);
	}
}

console.write('Generating types... ');
await $`tsc --declaration --emitDeclarationOnly --noEmit false`;
console.log(`Done.`);
