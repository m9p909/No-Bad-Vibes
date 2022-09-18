import {
  addMigrationInfo,
  removeMigrationInfo,
  migrate,
  shouldMigrate,
} from "./migrations";
import IDGenerator from "../ids";

export const ids = null;

export const updateRules = ({
  removeIds = [],
  addRules = [],
  rawRemoveIds = [],
  rawAddRules = [],
}) => {
  return chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [...addMigrationInfo(removeIds), ...rawRemoveIds],
    addRules: [...addMigrationInfo(addRules), ...rawAddRules],
  });
};

const initRawRules = async (rawRules = null) => {
  rawRules = rawRules || (await chrome.declarativeNetRequest.getDynamicRules());

  let migratedRuleIds = [];
  let migratedRules = [];
  let workingMaxId = 0;

  rawRules.forEach((rule) => {
    if (shouldMigrate(rule)) {
      migratedRuleIds.push(rule.id);

      rule = migrate(rule);
      migratedRules.push(rule);
    }

    const id = removeMigrationInfo(rule.id);
    if (id > workingMaxId) {
      workingMaxId = id;
    }
  });
  ids = new IDGenerator(workingMaxId);

  await updateRules({
    rawAddRules: migratedRules,
    rawRemoveIds: migratedRuleIds,
  });

  const nMigrated = migratedRules.length;
  nMigrated &&
    console.log(
      `Migration complete, ${nMigrated} rule${
        nMigrated === 1 ? "" : "s"
      } updated.`
    );
};

const maybeInitRawRules = async () => {
  if (ids == null) {
    await initRawRules();
  }
};
export { maybeInitRawRules as initRawRules };

export const getRawRules = async () => {
  const rawRules = await chrome.declarativeNetRequest.getDynamicRules();
  if (ids == null) {
    await initRawRules(rawRules);
    return getRawRules();
  }
  return removeMigrationInfo(rawRules);
};

export const makeRedirect = (urlString) => {
  let usingHost = true;
  if (urlString.startsWith("/")) {
    urlString = "somehost" + urlString;
    usingHost = false;
  }
  let usingProtocol = true;
  if (!urlString.includes("://")) {
    urlString = "http://" + urlString;
    usingProtocol = false;
  }

  const url = new URL(urlString);
  const fragment = url.hash || undefined;
  const host = usingHost ? url.hostname : undefined;
  const password = url.password || undefined;
  const path = url.pathname && url.pathname != "/" ? url.pathname : undefined;
  const port = url.port || undefined;
  const query = url.search || undefined;
  const scheme = usingProtocol ? url.protocol.slice(0, -1) : undefined;
  const username = url.username || undefined;

  return {
    transform: {
      fragment,
      host,
      password,
      path,
      port,
      query,
      scheme,
      username,
    },
  };
};

const escapeForRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

export const makeRule = (id, { rewrite, match }) => {
  let rewriteOptions = {
    exact: false,
  };
  if (typeof rewrite !== "string") {
    if (!rewrite || !rewrite.target) {
      throw new Error("rule.rewrite.target is required.");
    }
    rewriteOptions.exact = !!rewrite.exact;
    rewrite = rewrite.target;
  }
  if (rewrite.endsWith("/")) {
    // Short hack for now.
    rewrite = rewrite.substring(0, rewrite.length - 1);
  }
  if (rewriteOptions.exact && !rewrite.includes("://")) {
    rewrite = "http://" + rewrite;
  }

  let matchOptions = {
    regex: false,
  };
  if (typeof match !== "string") {
    if (!match || !match.query) {
      throw new Error("rule.match.query is required.");
    }
    matchOptions.regex = !!match.regex;
    match = match.query;
  }

  let condition, redirect;
  switch (matchOptions.regex) {
    case false:
      match = match.replace(/[^a-zA-Z0-9_-]/g, "");

      // https://stackoverflow.com/a/10444621/3761440
      match = match.replace("\\", "/");

      if (rewriteOptions.exact) {
        redirect = { url: rewrite };
      } else {
        redirect = makeRedirect(rewrite);
      }
      if (rewriteOptions.exact || !redirect.transform.path) {
        const urlFilter = "||" + match + "^";
        condition = { urlFilter };
        break;
      } else {
        // Else fall through.
        // Want to match only the TLD; according to
        // https://datatracker.ietf.org/doc/html/rfc1034#section-3.5, TLDs can
        // only contain alphanumeric characters, plus hyphens. Ensuring
        match = AUTO_REGEXP_START + escapeForRegExp(match) + AUTO_REGEXP_END;
        rewrite = (redirect.transform.scheme ? "" : "\\1") + rewrite + "\\2";
      }
    // eslint-disable-next-line no-fallthrough
    case true:
      condition = { regexFilter: match };
      redirect = { regexSubstitution: rewrite };
      break;
    default:
      throw new Error("rule.match.regex must be one of {true, false}.");
  }

  return {
    id,
    action: { type: "redirect", redirect },
    condition: { ...condition, resourceTypes: ["main_frame"] },
  };
};
