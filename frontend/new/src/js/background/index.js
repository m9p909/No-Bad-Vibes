import METHODS from "./methods";

const handleRequest = async (request) => {
  if (request?.for == "background" && METHODS?.[request.method]) {
    console.log(`Received request for method ${request.method}, processing...`);
    try {
      const result = await METHODS[request.method](request.data);
      const [response, error] = result || [];

      return {
        code: error ? 500 : 200,
        message: error ? "Internal Server Error" : "OK",
        data: error || response,
      };
    } catch (e) {
      console.error(e);
      console.log(e.stack);
      return {
        code: 500,
        message: "Internal Server Error",
        data: e.toString(),
      };
    }
  }
  return { code: 404, message: "Not Found", data: null };
};

chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  handleRequest(request).then(sendResponse);
  return true;
});
