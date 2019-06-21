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
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Client\", function() { return Client; });\n/* harmony import */ var _global_GlobalConstants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../global/GlobalConstants */ \"./global/GlobalConstants.ts\");\n/* harmony import */ var _global_Keys__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../global/Keys */ \"./global/Keys.ts\");\n\r\n\r\nvar Client = /** @class */ (function () {\r\n    function Client() {\r\n        this.socket = io();\r\n        this.character = new Image();\r\n        this.background = new Image();\r\n        console.log(\"A Client has started.\");\r\n        //HTML Variables\r\n        this.canvas = document.getElementById(\"myCanvas\");\r\n        this.context = this.canvas.getContext(\"2d\");\r\n        // Image Sources\r\n        this.character.src = \"./\" + _global_GlobalConstants__WEBPACK_IMPORTED_MODULE_0__[\"GlobalConstants\"].ASSET_FOLDER + \"character.png\";\r\n        this.background.src = \"./\" + _global_GlobalConstants__WEBPACK_IMPORTED_MODULE_0__[\"GlobalConstants\"].ASSET_FOLDER + \"background.png\";\r\n        this.drawBackground();\r\n        this.registerEvents();\r\n    }\r\n    Client.prototype.registerEvents = function () {\r\n        var _this = this;\r\n        //Event: Update with the new GameState\r\n        this.socket.on('update', function (gameState) {\r\n            _this.gameState = gameState;\r\n            _this.draw();\r\n        });\r\n        //Event: Signal the server that a key has been pressed.\r\n        window.addEventListener(\"keydown\", function (event) {\r\n            console.log(event.key);\r\n            _this.keyPressedHander(event.key, true);\r\n        }, true);\r\n        //Event: Stop moving when key is not pressed.\r\n        window.addEventListener(\"keyup\", function (event) {\r\n            _this.keyPressedHander(event.key, false);\r\n        }, true);\r\n    };\r\n    Client.prototype.keyPressedHander = function (inputId, state) {\r\n        if (Object.values(_global_Keys__WEBPACK_IMPORTED_MODULE_1__[\"Keys\"]).includes(inputId)) {\r\n            this.socket.emit('keyPressed', { inputId: inputId, state: state });\r\n        }\r\n    };\r\n    Client.prototype.draw = function () {\r\n        this.drawBackground();\r\n        this.drawCharacter();\r\n    };\r\n    Client.prototype.drawCharacter = function () {\r\n        for (var i = 0; i < this.gameState.length; i++) {\r\n            console.log(this.gameState[i].x);\r\n            this.context.drawImage(this.character, this.gameState[i].x, this.gameState[i].y, _global_GlobalConstants__WEBPACK_IMPORTED_MODULE_0__[\"GlobalConstants\"].PLAYER_HEIGHT, _global_GlobalConstants__WEBPACK_IMPORTED_MODULE_0__[\"GlobalConstants\"].PLAYER_WIDTH);\r\n        }\r\n    };\r\n    Client.prototype.drawBackground = function () {\r\n        // this.context.clearRect(0, 0, Const.CANVAS_WIDTH, Const.CANVAS_HEIGHT);\r\n        this.context.drawImage(this.background, 0, 0, _global_GlobalConstants__WEBPACK_IMPORTED_MODULE_0__[\"GlobalConstants\"].CANVAS_WIDTH, _global_GlobalConstants__WEBPACK_IMPORTED_MODULE_0__[\"GlobalConstants\"].CANVAS_HEIGHT);\r\n    };\r\n    return Client;\r\n}());\r\n\r\n\n\n//# sourceURL=webpack:///./client/Client.ts?");

/***/ }),

/***/ "./client/index.ts":
/*!*************************!*\
  !*** ./client/index.ts ***!
  \*************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Client */ \"./client/Client.ts\");\n\r\nnew _Client__WEBPACK_IMPORTED_MODULE_0__[\"Client\"]();\r\n\n\n//# sourceURL=webpack:///./client/index.ts?");

/***/ }),

/***/ "./global/GlobalConstants.ts":
/*!***********************************!*\
  !*** ./global/GlobalConstants.ts ***!
  \***********************************/
/*! exports provided: GlobalConstants */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"GlobalConstants\", function() { return GlobalConstants; });\nvar GlobalConstants = /** @class */ (function () {\r\n    function GlobalConstants() {\r\n    }\r\n    //Network Constants\r\n    GlobalConstants.PORT = 3000;\r\n    GlobalConstants.MAX_CLIENTS = 2;\r\n    GlobalConstants.SERVER_URL = \"http://localhost:\" + GlobalConstants.PORT;\r\n    GlobalConstants.ASSET_FOLDER = \"assets/\";\r\n    //Grid Constants\r\n    GlobalConstants.GRID_HEIGHT = 20; //Blocks\r\n    GlobalConstants.GRID_WIDTH = 30; //Blocks\r\n    GlobalConstants.BLOCK_HEIGHT = 32; //Pixels per Block\r\n    GlobalConstants.BLOCK_WIDTH = 32; // Pixels per Block\r\n    //Canvas Constants\r\n    GlobalConstants.CANVAS_HEIGHT = GlobalConstants.GRID_HEIGHT * GlobalConstants.BLOCK_HEIGHT; //640 Pixels\r\n    GlobalConstants.CANVAS_WIDTH = GlobalConstants.GRID_WIDTH * GlobalConstants.BLOCK_WIDTH; //960 Pixels\r\n    //Character Constants\r\n    GlobalConstants.PLAYER_HEIGHT = 120;\r\n    GlobalConstants.PLAYER_WIDTH = 120;\r\n    GlobalConstants.PLAYER_1_START_X_COORDS = 140;\r\n    GlobalConstants.PLAYER_2_START_X_COORDS = 820;\r\n    //Level Constants\r\n    GlobalConstants.GROUND_HEIGHT_FROM_BOTTOM = 80;\r\n    GlobalConstants.GROUND_HEIGHT_FROM_TOP = GlobalConstants.CANVAS_HEIGHT - GlobalConstants.GROUND_HEIGHT_FROM_BOTTOM - GlobalConstants.PLAYER_HEIGHT;\r\n    // Mechanical Constants\r\n    GlobalConstants.FRICTION = 0.9;\r\n    GlobalConstants.JUMP_HEIGHT = 60;\r\n    return GlobalConstants;\r\n}());\r\n\r\n\n\n//# sourceURL=webpack:///./global/GlobalConstants.ts?");

/***/ }),

/***/ "./global/Keys.ts":
/*!************************!*\
  !*** ./global/Keys.ts ***!
  \************************/
/*! exports provided: Keys */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Keys\", function() { return Keys; });\nvar Keys;\r\n(function (Keys) {\r\n    Keys[\"Up\"] = \"ArrowUp\";\r\n    Keys[\"Down\"] = \"ArrowDown\";\r\n    Keys[\"Left\"] = \"ArrowLeft\";\r\n    Keys[\"Right\"] = \"ArrowRight\";\r\n})(Keys || (Keys = {}));\r\n\n\n//# sourceURL=webpack:///./global/Keys.ts?");

/***/ })

/******/ });