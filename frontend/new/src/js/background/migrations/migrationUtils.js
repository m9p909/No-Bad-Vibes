import { getMigrationInfo, updateMigrationInfo } from "./migrationInfoUtils";
import { MIGRATIONS } from "./migrations";

export const shouldMigrate = (rule) => {
  return !!MIGRATIONS[getMigrationInfo(rule).version];
};

export const migrate = (rule) => {
  let migratedRule = rule;
  let migration = null;
  while (
    (migration = MIGRATIONS[getMigrationInfo(migratedRule).version]) != null
  ) {
    migratedRule = updateMigrationInfo(
      migration.resultingVersion,
      migration.run(migratedRule)
    );
  }
  return migratedRule;
};
