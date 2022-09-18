import migrateRegex from "./impl/migrateRegex";

export const CURRENT_VERSION = 1;

export const MIGRATIONS = {
  0: {
    resultingVersion: 1,
    run: migrateRegex(
      { start: "^((?:[^/]+://)?(?:[a-zA-Z0-9-]*.)?)", end: "(/.*|$)" },
      { start: "^((?:[^/]+://)?(?:[a-zA-Z0-9-]*)?)", end: "(/.*|$)" }
    ),
  },
};

// Make sure CURRENT_VERSION is up to date.
if (MIGRATIONS[CURRENT_VERSION] != null) {
  throw RangeError("Current version must not have any migrations");
}
