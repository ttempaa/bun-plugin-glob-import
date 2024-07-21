export {};

declare global {
	module '*.ts' {
		const value: Record<string, unknown>[];
		export default value;
	}

	module '*.js' {
		const value: Record<string, unknown>[];
		export default value;
	}
}
