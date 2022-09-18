import { CURRENT_VERSION } from "./migrations";

const nBits = (n) => -1 >>> (32 - n);

const N_MAX_BITS = 32;
const N_ID_BITS = 20;

const ID_BITS = nBits(N_ID_BITS);
const VERSION_BITS = nBits(N_MAX_BITS - N_ID_BITS);

const decodeIdFromIdBits = (bits) => bits & ID_BITS;

const decodeVersionFromIdBits = (bits) => (bits >> N_ID_BITS) & VERSION_BITS;

const encodeToIdBits = (version, id) => {
  if (id > ID_BITS) {
    throw new RangeError(`Out of range: id(${id}) > maxId(${ID_BITS})`);
  }
  if (version > VERSION_BITS) {
    throw new RangeError(
      `Out of range: version(${id}) > maxVersion(${VERSION_BITS})`
    );
  }

  return ((version & VERSION_BITS) << N_ID_BITS) | id;
};

const curry = (fn, version) => (obj) => fn(version, obj);

const addMigrationInfoToRule = (version, rule) => ({
  ...rule,
  id: encodeToIdBits(version, rule.id),
});
export const addMigrationInfo = (version, obj) => {
  if (Array.isArray(obj)) {
    if (obj.length && typeof obj[0] === "object") {
      return obj.map(curry(addMigrationInfoToRule, version));
    }
    return obj.map(curry(encodeToIdBits, version));
  }

  if (typeof obj === "object") {
    return addMigrationInfoToRule(version, obj);
  }

  return encodeToIdBits(version, obj);
};
export const addDefaultMigrationInfo = (obj) =>
  addMigrationInfo(CURRENT_VERSION, obj);

const removeMigrationInfoFromRule = (rule) => ({
  ...rule,
  id: decodeIdFromIdBits(rule.id),
});
export const removeMigrationInfo = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(removeMigrationInfoFromRule);
  }

  if (typeof obj === "object") {
    return removeMigrationInfoFromRule(obj);
  }

  return decodeIdFromIdBits(obj);
};

const updateMigrationInfoForId = (version, id) =>
  encodeToIdBits(version, decodeIdFromIdBits(id));
const updateMigrationInfoForRule = (version) => (rule) => ({
  ...rule,
  id: updateMigrationInfoForId(version, rule.id),
});
export const updateMigrationInfo = (version, obj) => {
  if (Array.isArray(obj)) {
    return obj.map(updateMigrationInfoForRule(version));
  }

  if (typeof obj === "object") {
    return updateMigrationInfoForRule(version)(obj);
  }

  return updateMigrationInfoForId(version, obj);
};

export const getMigrationInfo = ({ id }) => ({
  version: decodeVersionFromIdBits(id),
});
