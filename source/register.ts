import { plugin } from 'bun';
import { getPlugin } from './plugin';

// Works with dynamic import :>
await plugin(getPlugin());
