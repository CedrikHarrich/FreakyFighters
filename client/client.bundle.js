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
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Client\", function() { return Client; });\n/* harmony import */ var _global_GlobalConstants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../global/GlobalConstants */ \"./global/GlobalConstants.ts\");\n/* harmony import */ var _global_Keys__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../global/Keys */ \"./global/Keys.ts\");\n\n\nvar Client = /** @class */ (function () {\n    function Client() {\n        this.socket = io();\n        this.character = new Image();\n        this.background = new Image();\n        console.log(\"A Client has started.\");\n        //HTML Variables\n        this.canvas = document.getElementById(\"myCanvas\");\n        this.context = this.canvas.getContext(\"2d\");\n        // Image Sources\n        this.character.src = \"./\" + _global_GlobalConstants__WEBPACK_IMPORTED_MODULE_0__[\"GlobalConstants\"].ASSET_FOLDER + \"character.png\";\n        this.background.src = \"./\" + _global_GlobalConstants__WEBPACK_IMPORTED_MODULE_0__[\"GlobalConstants\"].ASSET_FOLDER + \"background.png\";\n        //Draw the initial background and start to register Events.\n        this.drawBackground();\n        this.registerEvents();\n    }\n    Client.prototype.registerEvents = function () {\n        var _this = this;\n        //Event: Update with the new GameState\n        this.socket.on('update', function (gameState) {\n            _this.gameState = gameState;\n            _this.draw();\n        });\n        //Event: Signal the server that a key has been pressed.\n        window.addEventListener(\"keydown\", function (event) {\n            console.log(event.key);\n            _this.keyPressedHandler(event.key, true);\n        }, true);\n        //Event: Stop moving when key is not pressed.\n        window.addEventListener(\"keyup\", function (event) {\n            _this.keyPressedHandler(event.key, false);\n        }, true);\n    };\n    Client.prototype.keyPressedHandler = function (inputId, state) {\n        if (Object.values(_global_Keys__WEBPACK_IMPORTED_MODULE_1__[\"Keys\"]).includes(inputId)) {\n            this.socket.emit('keyPressed', { inputId: inputId, state: state });\n        }\n    };\n    Client.prototype.draw = function () {\n        this.drawBackground();\n        this.drawCharacter();\n    };\n    Client.prototype.drawCharacter = function () {\n        for (var i = 0; i < this.gameState.length; i++) {\n            console.log(this.gameState[i].x);\n            this.context.drawImage(this.character, this.gameState[i].x, this.gameState[i].y, _global_GlobalConstants__WEBPACK_IMPORTED_MODULE_0__[\"GlobalConstants\"].PLAYER_HEIGHT, _global_GlobalConstants__WEBPACK_IMPORTED_MODULE_0__[\"GlobalConstants\"].PLAYER_WIDTH);\n        }\n    };\n    Client.prototype.drawBackground = function () {\n        this.context.drawImage(this.background, 0, 0, _global_GlobalConstants__WEBPACK_IMPORTED_MODULE_0__[\"GlobalConstants\"].CANVAS_WIDTH, _global_GlobalConstants__WEBPACK_IMPORTED_MODULE_0__[\"GlobalConstants\"].CANVAS_HEIGHT);\n    };\n    return Client;\n}());\n\n\n\n//# sourceURL=webpack:///./client/Client.ts?");

/***/ }),

/***/ "./client/index.ts":
/*!*************************!*\
  !*** ./client/index.ts ***!
  \*************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Client */ \"./client/Client.ts\");\n\nfunction main() {\n    new _Client__WEBPACK_IMPORTED_MODULE_0__[\"Client\"]();\n}\n//Entrance point of our client program.\nmain();\n\n\n//# sourceURL=webpack:///./client/index.ts?");

/***/ }),

/***/ "./global/GlobalConstants.ts":
/*!***********************************!*\
  !*** ./global/GlobalConstants.ts ***!
  \***********************************/
/*! exports provided: GlobalConstants */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"GlobalConstants\", function() { return GlobalConstants; });\nvar GlobalConstants = /** @class */ (function () {\n    function GlobalConstants() {\n    }\n    //Network Constants\n    GlobalConstants.PORT = 3000;\n    GlobalConstants.MAX_CLIENTS = 2;\n    GlobalConstants.SERVER_URL = \"http://localhost:\" + GlobalConstants.PORT;\n    GlobalConstants.ASSET_FOLDER = \"assets/\";\n    //Grid Constants\n    GlobalConstants.GRID_HEIGHT = 20; //Blocks\n    GlobalConstants.GRID_WIDTH = 30; //Blocks\n    GlobalConstants.BLOCK_HEIGHT = 32; //Pixels per Block\n    GlobalConstants.BLOCK_WIDTH = 32; // Pixels per Block\n    //Canvas Constants\n    GlobalConstants.CANVAS_HEIGHT = GlobalConstants.GRID_HEIGHT * GlobalConstants.BLOCK_HEIGHT; //640 Pixels\n    GlobalConstants.CANVAS_WIDTH = GlobalConstants.GRID_WIDTH * GlobalConstants.BLOCK_WIDTH; //960 Pixels\n    //Character Constants\n    GlobalConstants.PLAYER_HEIGHT = 120;\n    GlobalConstants.PLAYER_WIDTH = 120;\n    GlobalConstants.JUMP_HEIGHT = 95;\n    GlobalConstants.PLAYER_1_START_X_COORDS = 140;\n    GlobalConstants.PLAYER_2_START_X_COORDS = 820;\n    //Level Constants\n    GlobalConstants.GROUND_HEIGHT_FROM_BOTTOM = 80;\n    GlobalConstants.GROUND_HEIGHT_FROM_TOP = GlobalConstants.CANVAS_HEIGHT - GlobalConstants.GROUND_HEIGHT_FROM_BOTTOM - GlobalConstants.PLAYER_HEIGHT;\n    //Physics Constants\n    GlobalConstants.FRICTION = 0.9;\n    GlobalConstants.GRAVITATION = 3.0;\n    //Time and Frames Constants\n    GlobalConstants.FRAMES_PER_SECOND = 60;\n    //Acceleration Constants\n    GlobalConstants.ACCELERATION_X = 1.5;\n    GlobalConstants.ACCELERATION_Y = 2.0;\n    //Level Settings Constants\n    GlobalConstants.SOLID_WALLS = true;\n    GlobalConstants.SOLID_ROOF = true;\n    return GlobalConstants;\n}());\n\n\n\n//# sourceURL=webpack:///./global/GlobalConstants.ts?");

/***/ }),

/***/ "./global/Keys.ts":
/*!************************!*\
  !*** ./global/Keys.ts ***!
  \************************/
/*! exports provided: Keys */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Keys\", function() { return Keys; });\nvar Keys;\n(function (Keys) {\n    Keys[\"Up\"] = \"ArrowUp\";\n    Keys[\"Down\"] = \"ArrowDown\";\n    Keys[\"Left\"] = \"ArrowLeft\";\n    Keys[\"Right\"] = \"ArrowRight\";\n})(Keys || (Keys = {}));\n\n\n//# sourceURL=webpack:///./global/Keys.ts?");

/***/ })

/******/ });