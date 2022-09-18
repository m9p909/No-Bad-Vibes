import { initRawRules, makeRule, updateRules, ids } from "../common";

export default async (dataList) => {
  await initRawRules();

  const resultIds = [];
  const rules = dataList.map((data) => {
    const id = ids.allocate();
    resultIds.push(id);
    return makeRule(id, data);
  });
  await updateRules({ addRules: rules });
  return [resultIds, null];
};
