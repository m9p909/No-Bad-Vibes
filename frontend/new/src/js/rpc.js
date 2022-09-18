const rpc = (method, data) => {
  let resolve, reject;
  const result = new Promise((...methods) => {
    [resolve, reject] = methods;
  });
  chrome.runtime.sendMessage(
    { for: "background", method, data },
    (response) => {
      if (response?.code == 200) {
        resolve(response.data);
      } else {
        reject(response);
      }
    }
  );
  return result;
};
const genRpc =
  (name, passData = true) =>
  (data) =>
    rpc(name, passData ? data : undefined);

// getRules(): Rule[]
export const getRules = genRpc("getRules", false);

// addRule({ rewrite, match }): Id
export const addRule = genRpc("addRule");

// addRules([{ rewrite, match }]): Id[]
export const addRules = genRpc("addRules");

// replaceRule({ id, rewrite, match }): void
export const replaceRule = genRpc("replaceRule");

// deleteRule(id): void
export const deleteRule = genRpc("deleteRule");

window.getRules = getRules;
window.addRule = addRule;
window.replaceRule = replaceRule;
window.deleteRule = deleteRule;
