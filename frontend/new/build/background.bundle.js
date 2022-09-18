/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/background/methods/index.js":
/*!********************************************!*\
  !*** ./src/js/background/methods/index.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/*import addRule from "./addRule";
import getRules from "./getRules";
import addRules from "./addRules";
import deleteRule from "./deleteRule";
import replaceRule from "./replaceRule";

export default {
  addRule,
  addRules,
  deleteRule,
  getRules,
  replaceRule,
};
*/

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({});

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!************************************!*\
  !*** ./src/js/background/index.js ***!
  \************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _methods__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./methods */ "./src/js/background/methods/index.js");


const handleRequest = async (request) => {
  if (request?.for == "background" && _methods__WEBPACK_IMPORTED_MODULE_0__.default?.[request.method]) {
    console.log(`Received request for method ${request.method}, processing...`);
    try {
      const result = await _methods__WEBPACK_IMPORTED_MODULE_0__.default[request.method](request.data);
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

})();

/******/ })()
;
//# sourceMappingURL=background.bundle.js.map