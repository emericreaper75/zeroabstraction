import * as migration_20260910_022631_initial_schema from './20260910_022631_initial_schema';
import * as migration_20260910_024848 from './20260910_024848';

export const migrations = [
  {
    up: migration_20260910_022631_initial_schema.up,
    down: migration_20260910_022631_initial_schema.down,
    name: '20260910_022631_initial_schema',
  },
  {
    up: migration_20260910_024848.up,
    down: migration_20260910_024848.down,
    name: '20260910_024848'
  },
];
