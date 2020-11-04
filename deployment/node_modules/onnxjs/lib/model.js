"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Model = void 0;
var onnx_proto_1 = require("onnx-proto");
var graph_1 = require("./graph");
var util_1 = require("./util");
var Model = /** @class */ (function () {
    // empty model
    function Model() {
    }
    Model.prototype.load = function (buf, graphInitializer) {
        var modelProto = onnx_proto_1.onnx.ModelProto.decode(buf);
        var irVersion = util_1.LongUtil.longToNumber(modelProto.irVersion);
        if (irVersion < 3) {
            throw new Error('only support ONNX model with IR_VERSION>=3');
        }
        this._opsets = modelProto.opsetImport.map(function (i) {
            return { domain: i.domain, version: util_1.LongUtil.longToNumber(i.version) };
        });
        this._graph = graph_1.Graph.from(modelProto.graph, graphInitializer);
    };
    Object.defineProperty(Model.prototype, "graph", {
        get: function () {
            return this._graph;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Model.prototype, "opsets", {
        get: function () {
            return this._opsets;
        },
        enumerable: false,
        configurable: true
    });
    return Model;
}());
exports.Model = Model;
//# sourceMappingURL=model.js.map