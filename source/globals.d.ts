type ImportedModule = Record<string, unknown>;

declare module "*.ts" {
	const value: ImportedModule[];
	export default value;
	export const asObject: Record<string, ImportedModule>;
}

declare module "*.js" {
	const value: ImportedModule[];
	export default value;
	export const asObject: Record<string, ImportedModule>;
}
