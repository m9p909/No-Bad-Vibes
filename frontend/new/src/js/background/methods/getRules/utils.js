import { AUTO_REGEXP_END, AUTO_REGEXP_START } from "../matchConfig";
import { makeRedirect } from "../common";

export const isRegexMatch = (redirect, match, autoRegexp = null) =>
  redirect?.regexSubstitution?.endsWith("\\2") &&
  match.startsWith(autoRegexp?.start ?? AUTO_REGEXP_START) &&
  match.endsWith(autoRegexp?.end ?? AUTO_REGEXP_END);

export const getFilter = ({ regexFilter, urlFilter }) =>
  regexFilter || urlFilter.slice(2, -1);

export const getRewriteFromRedirect = (redirect, match) => {
  if (redirect.regexSubstitution) {
    if (isRegexMatch(redirect, match)) {
      try {
        const sliceStart = redirect.regexSubstitution.startsWith("\\1") ? 2 : 0;
        redirect = makeRedirect(
          redirect.regexSubstitution.slice(sliceStart, -2)
        );
        return getRewriteFromRedirect(redirect, match);
      } catch {
        // Fall through.
      }
    }
    return redirect.regexSubstitution;
  }
  if (redirect.url) {
    return { target: redirect.url, exact: true };
  }
  const { transform } = redirect;
  const {
    fragment = "",
    host = "",
    password = "",
    path = "",
    port = "",
    query = "",
    scheme = "",
    username = "",
  } = transform;
  const credentials = username + (password ? ":" + password : "");
  const credentialsFmt = credentials ? credentials + "@" : "";
  const protocol = scheme ? scheme + "://" : "";
  const portFmt = port ? ":" + port : "";
  return protocol + credentialsFmt + host + portFmt + path + query + fragment;
};

export const getMatchFromFilter = (filter, wasRegex) => {
  if (wasRegex) {
    if (
      filter.startsWith(AUTO_REGEXP_START) &&
      filter.endsWith(AUTO_REGEXP_END)
    ) {
      return filter.slice(AUTO_REGEXP_START.length, -AUTO_REGEXP_END.length);
    }
    return { query: filter, regex: true };
  }
  return filter;
};
