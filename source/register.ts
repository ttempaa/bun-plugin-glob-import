import { plugin } from 'bun';
import { getPlugin } from './plugin';

// Currently not working :<
await plugin(getPlugin());
