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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = void 0;
var fs_1 = require("fs");
var util_1 = require("util");
var backend_1 = require("./backend");
var execution_plan_1 = require("./execution-plan");
var instrument_1 = require("./instrument");
var model_1 = require("./model");
var Session = /** @class */ (function () {
    function Session(config) {
        if (config === void 0) { config = {}; }
        this._initialized = false;
        this.backendHint = config.backendHint;
        this.profiler = instrument_1.Profiler.create(config.profiler);
        this.context = { profiler: this.profiler, graphInputTypes: [], graphInputDims: [] };
    }
    Session.prototype.startProfiling = function () {
        this.profiler.start();
    };
    Session.prototype.endProfiling = function () {
        this.profiler.stop();
    };
    Session.prototype.loadModel = function (arg, byteOffset, length) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.profiler.event('session', 'Session.loadModel', function () { return __awaiter(_this, void 0, void 0, function () {
                            var backend, buf, response, buf, arr;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, backend_1.Backend(this.backendHint)];
                                    case 1:
                                        backend = _a.sent();
                                        this.sessionHandler = backend.createSessionHandler(this.context);
                                        this._model = new model_1.Model();
                                        if (!(typeof arg === 'string')) return [3 /*break*/, 7];
                                        if (!(typeof fetch === 'undefined')) return [3 /*break*/, 3];
                                        return [4 /*yield*/, util_1.promisify(fs_1.readFile)(arg)];
                                    case 2:
                                        buf = _a.sent();
                                        this.initialize(Buffer.from(buf));
                                        return [3 /*break*/, 6];
                                    case 3: return [4 /*yield*/, fetch(arg)];
                                    case 4:
                                        response = _a.sent();
                                        return [4 /*yield*/, response.arrayBuffer()];
                                    case 5:
                                        buf = _a.sent();
                                        this.initialize(Buffer.from(buf));
                                        _a.label = 6;
                                    case 6: return [3 /*break*/, 8];
                                    case 7:
                                        if (!ArrayBuffer.isView(arg)) {
                                            arr = new Uint8Array(arg, byteOffset || 0, length || arg.byteLength);
                                            this.initialize(Buffer.from(arr));
                                        }
                                        else {
                                            // load model from Uint8array
                                            this.initialize(Buffer.from(arg));
                                        }
                                        _a.label = 8;
                                    case 8: return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Session.prototype.initialize = function (modelProtoBlob) {
        var _this = this;
        if (this._initialized) {
            throw new Error('already initialized');
        }
        this.profiler.event('session', 'Session.initialize', function () {
            // load graph
            var graphInitializer = _this.sessionHandler.transformGraph ? _this.sessionHandler : undefined;
            _this._model.load(modelProtoBlob, graphInitializer);
            // graph is completely initialzied at this stage , let the interested handlers know
            if (_this.sessionHandler.onGraphInitialized) {
                _this.sessionHandler.onGraphInitialized(_this._model.graph);
            }
            // initialize each operator in the graph
            _this.initializeOps(_this._model.graph);
            // instantiate an ExecutionPlan object to be used by the Session object
            _this._executionPlan = new execution_plan_1.ExecutionPlan(_this._model.graph, _this._ops, _this.profiler);
        });
        this._initialized = true;
    };
    Session.prototype.run = function (inputs) {
        var _this = this;
        if (!this._initialized) {
            throw new Error('session not initialized yet');
        }
        return this.profiler.event('session', 'Session.run', function () { return __awaiter(_this, void 0, void 0, function () {
            var inputTensors, outputTensors;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        inputTensors = this.normalizeAndValidateInputs(inputs);
                        return [4 /*yield*/, this._executionPlan.execute(this.sessionHandler, inputTensors)];
                    case 1:
                        outputTensors = _a.sent();
                        return [2 /*return*/, this.createOutput(outputTensors)];
                }
            });
        }); });
    };
    Session.prototype.normalizeAndValidateInputs = function (inputs) {
        var modelInputNames = this._model.graph.getInputNames();
        // normalize inputs
        // inputs: Tensor[]
        if (Array.isArray(inputs)) {
            if (inputs.length !== modelInputNames.length) {
                throw new Error("incorrect input array length: expected " + modelInputNames.length + " but got " + inputs.length);
            }
        }
        // convert map to array
        // inputs: Map<string, Tensor>
        else {
            if (inputs.size !== modelInputNames.length) {
                throw new Error("incorrect input map size: expected " + modelInputNames.length + " but got " + inputs.size);
            }
            var sortedInputs = new Array(inputs.size);
            var sortedInputsIndex = 0;
            for (var i = 0; i < modelInputNames.length; ++i) {
                var tensor = inputs.get(modelInputNames[i]);
                if (!tensor) {
                    throw new Error("missing input tensor for: '" + name + "'");
                }
                sortedInputs[sortedInputsIndex++] = tensor;
            }
            inputs = sortedInputs;
        }
        // validate dims requirements
        // First session run - graph input data is not cached for the session
        if (!this.context.graphInputTypes || this.context.graphInputTypes.length === 0 || !this.context.graphInputDims ||
            this.context.graphInputDims.length === 0) {
            var modelInputIndices = this._model.graph.getInputIndices();
            var modelValues = this._model.graph.getValues();
            var graphInputDims = new Array(modelInputIndices.length);
            for (var i = 0; i < modelInputIndices.length; ++i) {
                var graphInput = modelValues[modelInputIndices[i]];
                graphInputDims[i] = graphInput.type.shape.dims;
                // cached for second and subsequent runs.
                // Some parts of the framework works on the assumption that the graph and types and shapes are static
                this.context.graphInputTypes.push(graphInput.type.tensorType);
                this.context.graphInputDims.push(inputs[i].dims);
            }
            this.validateInputTensorDims(graphInputDims, inputs, true);
        }
        // Second and subsequent session runs - graph input data is cached for the session
        else {
            this.validateInputTensorDims(this.context.graphInputDims, inputs, false);
        }
        // validate types requirement
        this.validateInputTensorTypes(this.context.graphInputTypes, inputs);
        return inputs;
    };
    Session.prototype.validateInputTensorTypes = function (graphInputTypes, givenInputs) {
        for (var i = 0; i < givenInputs.length; i++) {
            var expectedType = graphInputTypes[i];
            var actualType = givenInputs[i].type;
            if (expectedType !== actualType) {
                throw new Error("input tensor[" + i + "] check failed: expected type '" + expectedType + "' but got " + actualType);
            }
        }
    };
    Session.prototype.validateInputTensorDims = function (graphInputDims, givenInputs, noneDimSupported) {
        for (var i = 0; i < givenInputs.length; i++) {
            var expectedDims = graphInputDims[i];
            var actualDims = givenInputs[i].dims;
            if (!this.compareTensorDims(expectedDims, actualDims, noneDimSupported)) {
                throw new Error("input tensor[" + i + "] check failed: expected shape '[" + expectedDims.join(',') + "]' but got [" + actualDims.join(',') + "]");
            }
        }
    };
    Session.prototype.compareTensorDims = function (expectedDims, actualDims, noneDimSupported) {
        if (expectedDims.length !== actualDims.length) {
            return false;
        }
        for (var i = 0; i < expectedDims.length; ++i) {
            if (expectedDims[i] !== actualDims[i] && (!noneDimSupported || expectedDims[i] !== 0)) {
                // data shape mis-match AND not a 'None' dimension.
                return false;
            }
        }
        return true;
    };
    Session.prototype.createOutput = function (outputTensors) {
        var modelOutputNames = this._model.graph.getOutputNames();
        if (outputTensors.length !== modelOutputNames.length) {
            throw new Error("expected number of outputs do not match number of generated outputs");
        }
        var output = new Map();
        for (var i = 0; i < modelOutputNames.length; ++i) {
            output.set(modelOutputNames[i], outputTensors[i]);
        }
        return output;
    };
    Session.prototype.initializeOps = function (graph) {
        var nodes = graph.getNodes();
        this._ops = new Array(nodes.length);
        for (var i = 0; i < nodes.length; i++) {
            this._ops[i] = this.sessionHandler.resolve(nodes[i], this._model.opsets);
        }
    };
    return Session;
}());
exports.Session = Session;
//# sourceMappingURL=session.js.map