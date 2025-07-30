import { expect } from "bun:test";
import type { Fixture } from "../utils/types";

export const recursiveAndCollisionFixture: Fixture = {
	environment: ["builder", "runtime"],
	description: "a recursive glob with potential name collisions",
	files: {
		"api/users/handler.ts": `export const name = 'user_handler';`,
		"api/posts/handler.ts": `export const name = 'post_handler';`,
		"api/posts/comments/deep.ts": `export const name = 'deep_comment';`,
		"api/config.js": `export default 'ignored';`,
		"index.ts": `
            export const { asObject: handlers } = await import('./api/**/*.ts');
        `,
	},
	entrypoint: "index.ts",
	assert: (result) => {
		const expectedFilenames = [
			"api/users/handler.ts",
			"api/posts/handler.ts",
			"api/posts/comments/deep.ts",
		];

		const handlers = result.handlers as Record<string, any>;
		const receivedKeys = Object.keys(handlers).sort();
		expect(receivedKeys).toEqual(expectedFilenames.sort());

		expect(handlers["api/users/handler.ts"].name).toBe("user_handler");
		expect(handlers["api/posts/handler.ts"].name).toBe("post_handler");
		expect(handlers["api/posts/comments/deep.ts"].name).toBe("deep_comment");
	},
};
