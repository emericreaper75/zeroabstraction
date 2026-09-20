import * as migration_20260913_123350_initial_schema from './20260913_123350_initial_schema';

export const migrations = [
  {
    up: migration_20260913_123350_initial_schema.up,
    down: migration_20260913_123350_initial_schema.down,
    name: '20260913_123350_initial_schema'
  },
];
