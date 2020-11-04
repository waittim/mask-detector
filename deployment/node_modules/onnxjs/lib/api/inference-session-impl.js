"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InferenceSession = void 0;
var session_1 = require("../session");
var tensorUtils = __importStar(require("./tensor-impl-utils"));
var InferenceSession = /** @class */ (function () {
    function InferenceSession(config) {
        this.session = new session_1.Session(config);
    }
    InferenceSession.prototype.loadModel = function (arg0, byteOffset, length) {
        if (typeof arg0 === 'string') {
            return this.session.loadModel(arg0);
        }
        else if (typeof Blob !== 'undefined' && (arg0 instanceof Blob)) {
            // create a url from Blob
            var url = URL.createObjectURL(arg0);
            return this.session.loadModel(url);
        }
        else if (arg0 instanceof ArrayBuffer) {
            // load model from array buffer
            return this.session.loadModel(arg0, byteOffset, length);
        }
        else if (ArrayBuffer.isView(arg0)) {
            // load model from Uint8array
            return this.session.loadModel(arg0);
        }
        else {
            throw new Error('Model type is not supported.');
        }
    };
    InferenceSession.prototype.run = function (inputFeed, options) {
        return __awaiter(this, void 0, void 0, function () {
            var output, modelInputFeed_1, modelInputFeed_2, modelInputFeed, name_1, convertedOutput;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        output = new Map();
                        if (!(inputFeed instanceof Map)) return [3 /*break*/, 2];
                        modelInputFeed_1 = new Map();
                        inputFeed.forEach(function (value, key) {
                            modelInputFeed_1.set(key, value.internalTensor);
                        });
                        return [4 /*yield*/, this.session.run(modelInputFeed_1)];
                    case 1:
                        output = _a.sent();
                        return [3 /*break*/, 5];
                    case 2:
                        if (!Array.isArray(inputFeed)) return [3 /*break*/, 4];
                        modelInputFeed_2 = [];
                        inputFeed.forEach(function (value) {
                            modelInputFeed_2.push(value.internalTensor);
                        });
                        return [4 /*yield*/, this.session.run(modelInputFeed_2)];
                    case 3:
                        output = _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        modelInputFeed = new Map();
                        for (name_1 in inputFeed) {
                            modelInputFeed.set(name_1, inputFeed[name_1].internalTensor);
                        }
                        _a.label = 5;
                    case 5:
                        convertedOutput = new Map();
                        output.forEach(function (value, key) {
                            convertedOutput.set(key, tensorUtils.fromInternalTensor(value));
                        });
                        return [2 /*return*/, convertedOutput];
                }
            });
        });
    };
    InferenceSession.prototype.startProfiling = function () {
        this.session.startProfiling();
    };
    InferenceSession.prototype.endProfiling = function () {
        this.session.endProfiling();
    };
    return InferenceSession;
}());
exports.InferenceSession = InferenceSession;
//# sourceMappingURL=inference-session-impl.js.map