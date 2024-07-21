import { type BunPlugin } from 'bun';
import { getPlugin } from './plugin';

const globImportPlugin = (): BunPlugin => getPlugin();

export { globImportPlugin };
export default globImportPlugin;
