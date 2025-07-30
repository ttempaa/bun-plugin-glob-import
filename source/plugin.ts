import { dirname, extname, join, relative } from "node:path";
import { type BunPlugin, Glob, type PluginBuilder } from "bun";

type ImportData = { cwd: string; pattern: string };

const namespace = "glob-import-plugin";
const globFilter = /(?:\*\*|[*?[\]{}])/;

export const getPlugin = (): BunPlugin => ({
	name: namespace,
	setup: async (build: PluginBuilder) => {
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
			const importData = imports.get(args.path);
			if (!importData) {
				return;
			}

			const { cwd, pattern } = importData;
			const glob = new Glob(pattern);
			const scannedFiles = await Array.fromAsync(
				glob.scan({ cwd, absolute: true }),
			);
			const importsStatements = scannedFiles
				.map(
					(file, index) =>
						`import * as mod${index} from ${JSON.stringify(file)};`,
				)
				.join("\n");
			const exportsArray = scannedFiles
				.map((_, index) => `mod${index}`)
				.join(",");
			const objectProperties = scannedFiles
				.map((file, index) => {
					const relativePath = relative(cwd, file);
					return `${JSON.stringify(relativePath)}: mod${index}`;
				})
				.join(",\n");
			const contents = `
${importsStatements}
export const asObject = {
	${objectProperties}
};
export default [${exportsArray}];`;

			return {
				contents,
				loader: args.loader,
			};
		});
	},
});
