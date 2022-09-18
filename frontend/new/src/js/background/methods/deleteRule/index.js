import { initRawRules, updateRules, ids } from "../common";

export default async (id) => {
  await initRawRules();

  await updateRules({ removeIds: [id] });
  ids.free(id);
};
