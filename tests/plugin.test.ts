import {
	afterAll,
	afterEach,
	beforeEach,
	describe,
	expect,
	test,
} from "bun:test";
import { rmSync } from "node:fs";
import { join } from "node:path";
import { getPlugin } from "../source/plugin";
import { basicGlobFixture } from "./fixtures/basicGlob";
import { emptyGlobFixture } from "./fixtures/emptyGlob";
import { multiImportFixture } from "./fixtures/multiImport";
import { recursiveAndCollisionFixture } from "./fixtures/recursiveAndCollision";
import {
	cleanupTestEnvironment,
	setupTestEnvironment,
} from "./utils/environment";

const testScenarios = [
	emptyGlobFixture,
	basicGlobFixture,
	recursiveAndCollisionFixture,
	multiImportFixture,
];

afterAll(cleanupTestEnvironment);

for (const scenario of testScenarios) {
	describe(scenario.description, () => {
		let testDir: string;
		let outDir: string;

		beforeEach(() => {
			const testId = Bun.hash(scenario.description).toString(16);
			const paths = setupTestEnvironment(testId, scenario.files);
			testDir = paths.testDir;
			outDir = paths.outDir;
		});

		afterEach(() => {
			rmSync(testDir, { recursive: true, force: true });
		});

		if (scenario.environment.includes("builder")) {
			test("should work correctly in builder mode", async () => {
				const build = await Bun.build({
					entrypoints: [join(testDir, scenario.entrypoint)],
					outdir: outDir,
					plugins: [getPlugin()],
				});
				const result = await import(build.outputs[0].path);
				await scenario.assert(result);
			});
		}

		if (scenario.environment.includes("runtime")) {
			test("should work correctly in runtime mode", async () => {
				const assertFunctionAsString = scenario.assert.toString();
				const runtimeRunnerContent = `
                    import { expect } from 'bun:test';

                    (async () => {
                        try {
                            const entrypointExports = await import('./${scenario.entrypoint}');
                            const assertFunction = ${assertFunctionAsString};
                            await assertFunction(entrypointExports);
                            process.exit(0);
                        } catch (error) {
                            console.error(error);
                            process.exit(1);
                        }
                    })();
                `;

				const runtimeRunnerPath = join(testDir, "runtimeRunner.ts");
				await Bun.write(runtimeRunnerPath, runtimeRunnerContent);
				const process = Bun.spawn(["bun", "run", runtimeRunnerPath], {
					cwd: testDir,
					stdout: "pipe",
					stderr: "pipe",
				});
				const exitCode = await process.exited;

				if (exitCode !== 0) {
					const stderr = await new Response(process.stderr).text();
					throw new Error(
						`Runtime assertion failed with exit code ${exitCode}:\n\n${stderr}`,
					);
				}

				expect(exitCode).toBe(0);
			});
		}
	});
}
