import { expect } from "bun:test";
import type { Fixture } from "../utils/types";

export const emptyGlobFixture: Fixture = {
	environment: ["builder", "runtime"],
	description: "a glob that matches no files",
	files: {
		"src/commands/readme.md": `This is not a ts file.`,
		"src/index.ts": `
            const { default: modules, asObject } = await import('./commands/*.ts');
            export { modules as defaultExport, asObject as namedExport };
        `,
	},
	entrypoint: "src/index.ts",
	assert: (result) => {
		const defaultExport = result.defaultExport as any[];
		expect(defaultExport).toBeArray();
		expect(defaultExport).toBeEmpty();

		const namedExport = result.namedExport as Record<string, any>;
		expect(namedExport).toBeObject();
		expect(Object.keys(namedExport)).toBeEmpty();
	},
};
