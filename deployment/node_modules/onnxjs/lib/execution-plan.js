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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutionPlan = void 0;
var instrument_1 = require("./instrument");
var KernelOp = /** @class */ (function () {
    function KernelOp(op, node) {
        this.op = op;
        this.node = node;
    }
    return KernelOp;
}());
var ExecutionPlan = /** @class */ (function () {
    function ExecutionPlan(graph, ops, profiler) {
        this.graph = graph;
        this.profiler = profiler;
        this.initialize(ops);
    }
    ExecutionPlan.prototype.initialize = function (ops) {
        var _this = this;
        this.profiler.event('session', 'ExecutionPlan.initialize', function () {
            var graphNodes = _this.graph.getNodes();
            if (graphNodes.length !== ops.length) {
                throw new Error('The size of nodes and OPs do not match.');
            }
            _this._ops = ops.map(function (op, i) { return new KernelOp(op, graphNodes[i]); });
            _this.reset();
            // look for starter node(s)
            _this._starter = [];
            _this._ops.forEach(function (op, i) {
                var e_1, _a;
                var resolved = true;
                try {
                    for (var _b = __values(op.node.inputs), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var input = _c.value;
                        if (!_this._values[input] // not an initialized input
                            && _this.graph.getInputIndices().indexOf(input) === -1 // not model input
                        ) {
                            resolved = false;
                            break;
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                if (resolved) {
                    _this._starter.push(i);
                }
            });
        });
    };
    ExecutionPlan.prototype.reset = function () {
        this._values = this.graph.getValues().map(function (i) { return i.tensor; });
    };
    ExecutionPlan.prototype.execute = function (sessionHandler, modelInputs) {
        var _this = this;
        return this.profiler.event('session', 'ExecutionPlan.execute', function () { return __awaiter(_this, void 0, void 0, function () {
            var inferenceHandler, graphInputs, sequence, graphValues, graphNodes, rear, _loop_1, this_1, output;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // reset mediem result
                        this.reset();
                        inferenceHandler = sessionHandler.createInferenceHandler();
                        graphInputs = this.graph.getInputIndices();
                        if (modelInputs.length !== graphInputs.length) {
                            throw new Error("number of input tensors don't match the number of inputs to the model: actual: " + modelInputs.length + " expected: " + graphInputs.length);
                        }
                        modelInputs.forEach(function (input, i) {
                            var index = graphInputs[i];
                            _this._values[index] = input;
                        });
                        sequence = this._starter.slice(0);
                        graphValues = this.graph.getValues();
                        graphNodes = this.graph.getNodes();
                        rear = 0;
                        _loop_1 = function () {
                            var thisOpIndex, thisOp, inputList, inputTensors, outputList, downstreamNodes;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        thisOpIndex = sequence[rear++];
                                        thisOp = this_1._ops[thisOpIndex];
                                        inputList = thisOp.node.inputs.map(function (i) { return _this._values[i]; });
                                        if (inputList.indexOf(undefined) !== -1) {
                                            throw new Error("unresolved input detected: op: " + thisOp.node);
                                        }
                                        inputTensors = inputList;
                                        instrument_1.Logger.verbose('ExecPlan', "Runing op:" + thisOp.node.name + " (" + inputTensors.map(function (t, i) { return "'" + thisOp.node.inputs[i] + "': " + t.type + "[" + t.dims.join(',') + "]"; }).join(', ') + ")");
                                        return [4 /*yield*/, this_1.profiler.event('node', thisOp.node.name, function () { return __awaiter(_this, void 0, void 0, function () {
                                                var op, result;
                                                return __generator(this, function (_a) {
                                                    op = thisOp.op;
                                                    if (!op.checkInputs(inputTensors)) {
                                                        throw new Error("invalid inputs detected; op: " + thisOp.node.name);
                                                    }
                                                    result = op.run(inferenceHandler, inputTensors);
                                                    return [2 /*return*/, result];
                                                });
                                            }); })];
                                    case 1:
                                        outputList = _a.sent();
                                        // check output
                                        if (outputList.length !== thisOp.node.outputs.length) {
                                            throw new Error('the size of output does not match model definition.');
                                        }
                                        // fill value
                                        outputList.forEach(function (output, i) {
                                            var j = thisOp.node.outputs[i];
                                            if (_this._values[j]) {
                                                throw new Error("output [" + j + "] already has value: op:" + thisOp.node.name);
                                            }
                                            _this._values[j] = output;
                                        });
                                        downstreamNodes = new Set();
                                        outputList.forEach(function (output, i) {
                                            var e_2, _a, e_3, _b;
                                            var j = thisOp.node.outputs[i];
                                            try {
                                                for (var _c = (e_2 = void 0, __values(graphValues[j].to)), _d = _c.next(); !_d.done; _d = _c.next()) {
                                                    var currentDownstreamNodeIndex = _d.value;
                                                    var currentDownstreamNode = graphNodes[currentDownstreamNodeIndex];
                                                    var resolved = true;
                                                    try {
                                                        for (var _e = (e_3 = void 0, __values(currentDownstreamNode.inputs)), _f = _e.next(); !_f.done; _f = _e.next()) {
                                                            var k = _f.value;
                                                            if (!_this._values[k]) {
                                                                resolved = false;
                                                                break;
                                                            }
                                                        }
                                                    }
                                                    catch (e_3_1) { e_3 = { error: e_3_1 }; }
                                                    finally {
                                                        try {
                                                            if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                                                        }
                                                        finally { if (e_3) throw e_3.error; }
                                                    }
                                                    if (resolved) {
                                                        downstreamNodes.add(currentDownstreamNodeIndex);
                                                    }
                                                }
                                            }
                                            catch (e_2_1) { e_2 = { error: e_2_1 }; }
                                            finally {
                                                try {
                                                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                                                }
                                                finally { if (e_2) throw e_2.error; }
                                            }
                                        });
                                        sequence.push.apply(sequence, __spread(downstreamNodes));
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _a.label = 1;
                    case 1:
                        if (!(rear < sequence.length)) return [3 /*break*/, 3];
                        return [5 /*yield**/, _loop_1()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 1];
                    case 3:
                        output = [];
                        this.graph.getOutputIndices().forEach(function (outputIndex, i) {
                            var thisValue = _this._values[outputIndex];
                            if (thisValue === undefined) {
                                throw new Error("required output [" + outputIndex + "] does not have value");
                            }
                            // tslint:disable-next-line:no-unused-expression-chai
                            thisValue.data;
                            output.push(thisValue);
                        });
                        instrument_1.Logger.verbose('ExecPlan', 'disposing of inferenceHandler');
                        inferenceHandler.dispose();
                        return [2 /*return*/, output];
                }
            });
        }); });
    };
    return ExecutionPlan;
}());
exports.ExecutionPlan = ExecutionPlan;
//# sourceMappingURL=execution-plan.js.map