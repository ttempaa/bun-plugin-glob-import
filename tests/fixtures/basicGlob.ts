import { expect } from "bun:test";
import type { Fixture } from "../utils/types";

export const basicGlobFixture: Fixture = {
	environment: ["builder", "runtime"],
	description: "a simple, non-recursive glob",
	files: {
		"src/commands/create.ts": `export default () => 'create';`,
		"src/commands/delete.ts": `export default () => 'delete';`,
		"src/commands/nested/ignored.ts": `export default () => 'ignored';`,
		"src/index.ts": `
            const { default: modules, asObject } = await import('./commands/*.ts');
            export { modules as defaultExport, asObject as namedExport };
        `,
	},
	entrypoint: "src/index.ts",
	assert: (result) => {
		const expectedFilenames = ["commands/create.ts", "commands/delete.ts"];
		const expectedContent = ["create", "delete"];

		const defaultExport = result.defaultExport as any[];
		expect(defaultExport).toBeArrayOfSize(2);
		const defaultResults = defaultExport.map((m) => m.default()).sort();
		expect(defaultResults).toEqual(expectedContent);

		const namedExport = result.namedExport as Record<string, any>;
		const namedKeys = Object.keys(namedExport).sort();
		expect(namedKeys).toEqual(expectedFilenames.sort());
		const namedResults = Object.values(namedExport)
			.map((m) => m.default())
			.sort();
		expect(namedResults).toEqual(expectedContent);
	},
};
