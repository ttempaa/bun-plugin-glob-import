import { expect } from "bun:test";
import type { Fixture } from "../utils/types";

export const multiImportFixture: Fixture = {
	environment: ["builder", "runtime"],
	description: "multiple glob imports with different export types",
	files: {
		"modules/auth.ts": `export default 'auth_module';`,
		"modules/logger.ts": `export default 'logger_module';`,
		"services/email.ts": `export const send = () => 'email_sent';`,
		"services/sms.ts": `export const send = () => 'sms_sent';`,
		"index.ts": `
            export const { default: modules } = await import('./modules/*.ts');
            export const { asObject: services } = await import('./services/*.ts');
        `,
	},
	entrypoint: "index.ts",
	assert: (result) => {
		const modules = result.modules as any[];
		expect(modules).toBeArrayOfSize(2);
		const moduleNames = modules.map((m) => m.default).sort();
		expect(moduleNames).toEqual(["auth_module", "logger_module"]);

		const services = result.services as Record<string, any>;
		expect(Object.keys(services)).toHaveLength(2);
		expect(services["services/email.ts"].send()).toBe("email_sent");
		expect(services["services/sms.ts"].send()).toBe("sms_sent");
	},
};
