"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Backend = void 0;
// caches all initialized backend instances
var backendsCache = new Map();
/**
 * Resolve a reference to the backend. If a hint is specified, the corresponding
 * backend will be used.
 */
function Backend(hint) {
    return __awaiter(this, void 0, void 0, function () {
        var hints, hints_1, hints_1_1, backendHint, cache, backend, e_1_1;
        var e_1, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!!hint) return [3 /*break*/, 1];
                    return [2 /*return*/, Backend(['webgl', 'wasm', 'cpu'])];
                case 1:
                    hints = typeof hint === 'string' ? [hint] : hint;
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 7, 8, 9]);
                    hints_1 = __values(hints), hints_1_1 = hints_1.next();
                    _b.label = 3;
                case 3:
                    if (!!hints_1_1.done) return [3 /*break*/, 6];
                    backendHint = hints_1_1.value;
                    cache = backendsCache.get(backendHint);
                    if (cache) {
                        return [2 /*return*/, cache];
                    }
                    return [4 /*yield*/, tryLoadBackend(backendHint)];
                case 4:
                    backend = _b.sent();
                    if (backend) {
                        return [2 /*return*/, backend];
                    }
                    _b.label = 5;
                case 5:
                    hints_1_1 = hints_1.next();
                    return [3 /*break*/, 3];
                case 6: return [3 /*break*/, 9];
                case 7:
                    e_1_1 = _b.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 9];
                case 8:
                    try {
                        if (hints_1_1 && !hints_1_1.done && (_a = hints_1.return)) _a.call(hints_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                    return [7 /*endfinally*/];
                case 9: throw new Error('no available backend to use');
            }
        });
    });
}
exports.Backend = Backend;
function tryLoadBackend(backendHint) {
    return __awaiter(this, void 0, void 0, function () {
        var backendObj, backend, init;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    backendObj = onnx.backend;
                    if (!(typeof backendObj[backendHint] !== 'undefined' && isBackend(backendObj[backendHint]))) return [3 /*break*/, 3];
                    if (!!backendObj[backendHint].disabled) return [3 /*break*/, 3];
                    backend = backendObj[backendHint];
                    init = backend.initialize();
                    if (!(typeof init === 'object' && 'then' in init)) return [3 /*break*/, 2];
                    return [4 /*yield*/, init];
                case 1:
                    init = _a.sent();
                    _a.label = 2;
                case 2:
                    if (init) {
                        backendsCache.set(backendHint, backend);
                        return [2 /*return*/, backend];
                    }
                    _a.label = 3;
                case 3: return [2 /*return*/, undefined];
            }
        });
    });
}
function isBackend(obj) {
    // tslint:disable-next-line:no-any
    var o = obj;
    // check if an object is a Backend instance
    if ('initialize' in o && typeof o.initialize === 'function' && // initialize()
        'createSessionHandler' in o && typeof o.createSessionHandler === 'function' && // createSessionHandler()
        'dispose' in o && typeof o.dispose === 'function' // dispose()
    ) {
        return true;
    }
    return false;
}
//# sourceMappingURL=backend.js.map