import { Glob, type BunPlugin, type PluginBuilder } from 'bun';
import { dirname, extname, join } from 'path';

const namespace = 'glob-import-plugin';

export const getPlugin = (): BunPlugin => ({
	name: namespace,
	setup: async (build: PluginBuilder) => {
		type ImportData = { cwd: string; pattern: string };
		const globFilter = /(?:\*\*|[*?[\]{}])/;
		const imports = new Map<string, ImportData>();

		build.onResolve({ filter: globFilter }, async (args) => {
			const pattern = join(args.path);
			const cwd = dirname(args.importer);
			const extension = extname(args.path);
			const hash = Bun.hash(cwd + pattern).toString(16);
			const path = `glob:${hash}${extension}`;
			imports.set(path, { cwd, pattern });
			return { path, namespace };
		});

		build.onLoad({ filter: /^glob:/, namespace }, async (args) => {
			const { cwd, pattern } = imports.get(args.path)!;
			const glob = new Glob(pattern);
			const scannedFiles = await Array.fromAsync(glob.scan({ cwd, absolute: true }));
			const importsStatements = scannedFiles
				.map((file, index) => `import * as mod${index} from ${JSON.stringify(file)};`)
				.join('\n');
			const exportsArray = scannedFiles.map((_, index) => `mod${index}`).join(',');
			const contents = `${importsStatements}\nexport default [${exportsArray}];`;
			return {
				contents,
				loader: args.loader,
			};
		});
	},
});
