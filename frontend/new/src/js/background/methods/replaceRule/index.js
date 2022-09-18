import { initRawRules, makeRule, updateRules } from "../common";

export default async (data) => {
  await initRawRules();

  const { id } = data;
  const rule = makeRule(id, data);
  await updateRules({ removeIds: [id], addRules: [rule] });
};
