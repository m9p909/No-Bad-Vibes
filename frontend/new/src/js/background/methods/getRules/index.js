import { getRawRules } from "../common";
import { getFilter, getRewriteFromRedirect, getMatchFromFilter } from "./utils";

export default async () => {
  const rawRules = await getRawRules();
  const mappedRules = rawRules.map(
    ({ action: { redirect }, condition, id }) => {
      const filter = getFilter(condition);
      const rewrite = getRewriteFromRedirect(redirect, filter);
      const match = getMatchFromFilter(filter, !!condition.regexFilter);
      return { id, rewrite, match };
    }
  );
  return [mappedRules, null];
};
