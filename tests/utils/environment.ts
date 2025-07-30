import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

export const baseFixtureDir = resolve(process.cwd(), "tests", "test-fixture");

export const setupTestEnvironment = (
	testId: string,
	files: Record<string, string>,
) => {
	const testDir = join(baseFixtureDir, `test-${testId}`);
	const outDir = join(testDir, "dist");

	rmSync(testDir, { recursive: true, force: true });
	mkdirSync(outDir, { recursive: true });

	for (const [relativePath, content] of Object.entries(files)) {
		const absolutePath = join(testDir, relativePath);
		mkdirSync(dirname(absolutePath), { recursive: true });
		writeFileSync(absolutePath, content);
	}

	writeFileSync(
		join(testDir, "bunfig.toml"),
		`preload = ["${resolve(process.cwd(), "source", "register.ts")}"]`,
	);

	return { testDir, outDir };
};

export const cleanupTestEnvironment = () => {
	rmSync(baseFixtureDir, { recursive: true, force: true });
};
