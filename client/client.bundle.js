/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./client/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./client/Client.ts":
/*!**************************!*\
  !*** ./client/Client.ts ***!
  \**************************/
/*! exports provided: Client */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Client\", function() { return Client; });\nvar Client = /** @class */ (function () {\r\n    function Client() {\r\n        var _this = this;\r\n        console.log(\"A Client has started.\");\r\n        //Server Connection Variables\r\n        this.socket = io();\r\n        //HTML Variables\r\n        this.canvas = document.getElementById(\"myCanvas\");\r\n        this.context = this.canvas.getContext(\"2d\");\r\n        //Initially draw your field.\r\n        this.character = new Image();\r\n        //Randomizer for the character representation.\r\n        this.character.src = 'character.png';\r\n        this.background = new Image();\r\n        this.background.src = 'background.png';\r\n        this.background.onload = function () {\r\n            _this.context.drawImage(_this.background, 0, 0);\r\n        };\r\n        //Event: Update with the new GameState\r\n        this.socket.on('update', function (data) {\r\n            //console.log(\"Updates received.\");\r\n            _this.context.clearRect(0, 0, 960, 640);\r\n            _this.context.drawImage(_this.background, 0, 0, 960, 640);\r\n            for (var i = 0; i < data.length; i++) {\r\n                console.log(data[i].x);\r\n                _this.context.drawImage(_this.character, data[i].x, data[i].y, 120, 120);\r\n            }\r\n        });\r\n        //Event: Signal the server that a key has been pressed.\r\n        window.addEventListener(\"keydown\", function (event) {\r\n            console.log(event.key);\r\n            switch (event.key) {\r\n                case \"ArrowUp\":\r\n                    _this.socket.emit('keyPressed', { inputId: 'ArrowUp', state: true });\r\n                    break;\r\n                case \"ArrowLeft\":\r\n                    _this.socket.emit('keyPressed', { inputId: 'ArrowLeft', state: true });\r\n                    break;\r\n                case \"ArrowDown\":\r\n                    _this.socket.emit('keyPressed', { inputId: 'ArrowDown', state: true });\r\n                    break;\r\n                case \"ArrowRight\":\r\n                    _this.socket.emit('keyPressed', { inputId: 'ArrowRight', state: true });\r\n                    break;\r\n                default:\r\n                    return;\r\n            }\r\n        }, true);\r\n        //Event: Stop moving when key is not pressed.\r\n        window.addEventListener(\"keyup\", function (event) {\r\n            switch (event.key) {\r\n                case \"ArrowUp\":\r\n                    _this.socket.emit('keyPressed', { inputId: 'ArrowUp', state: false });\r\n                    break;\r\n                case \"ArrowLeft\":\r\n                    _this.socket.emit('keyPressed', { inputId: 'ArrowLeft', state: false });\r\n                    break;\r\n                case \"ArrowDown\":\r\n                    _this.socket.emit('keyPressed', { inputId: 'ArrowDown', state: false });\r\n                    break;\r\n                case \"ArrowRight\":\r\n                    _this.socket.emit('keyPressed', { inputId: 'ArrowRight', state: false });\r\n                    break;\r\n                default:\r\n                    return;\r\n            }\r\n        }, true);\r\n    }\r\n    return Client;\r\n}());\r\n\r\n\n\n//# sourceURL=webpack:///./client/Client.ts?");

/***/ }),

/***/ "./client/index.ts":
/*!*************************!*\
  !*** ./client/index.ts ***!
  \*************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Client */ \"./client/Client.ts\");\n\r\nnew _Client__WEBPACK_IMPORTED_MODULE_0__[\"Client\"]();\r\n\n\n//# sourceURL=webpack:///./client/index.ts?");

/***/ })

/******/ });