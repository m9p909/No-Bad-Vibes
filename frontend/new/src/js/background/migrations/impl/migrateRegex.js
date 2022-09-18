import { getFilter, isRegexMatch } from "../../matchUtils";

export default (from, to) => (rule) => {
  const {
    action: { redirect },
    condition,
  } = rule;
  if (!redirect) return rule;

  const filter = getFilter(condition);
  if (!isRegexMatch(redirect, filter, from)) {
    return rule;
  }

  const { regexFilter } = condition;
  const regexFilterWithoutStart = regexFilter.slice(
    regexFilter.indexOf(from.start) + from.start.length
  );
  const coreRegexFilter = regexFilterWithoutStart.slice(
    0,
    regexFilterWithoutStart.indexOf(from.end)
  );
  return {
    ...rule,
    condition: { regexFilter: to.start + coreRegexFilter + to.end },
  };
};
