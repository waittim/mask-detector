"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShapeUtilsGlslLib = void 0;
var glsl_definitions_1 = require("./glsl-definitions");
/**
 * GLSL Library responsible for data types and routines for manipulating
 * coordinates and mapping to/from tensor indices
 */
var ShapeUtilsGlslLib = /** @class */ (function (_super) {
    __extends(ShapeUtilsGlslLib, _super);
    function ShapeUtilsGlslLib(context) {
        return _super.call(this, context) || this;
    }
    ShapeUtilsGlslLib.prototype.getFunctions = function () {
        return __assign(__assign(__assign(__assign(__assign({}, this.bcastIndex()), this.bcastMatmulIndex()), this.offsetToIndices()), this.indicesToOffset()), this.incrementIndices());
    };
    ShapeUtilsGlslLib.prototype.getCustomTypes = function () {
        return {};
    };
    ShapeUtilsGlslLib.prototype.bcastIndex = function () {
        var programInfo = this.context.programInfo;
        var outputRank = programInfo.outputLayout.shape.length;
        var result = {};
        this.context.programInfo.samplers.forEach(function (name, i) {
            var shape = programInfo.inputLayouts[i].shape;
            if (shape.length <= outputRank) {
                var rank = shape.length;
                var dimOffset = outputRank - rank;
                var funcName = "bcastIndices_" + name;
                var block = '';
                for (var i_1 = 0; i_1 < rank; ++i_1) {
                    block += "\n          realIndices[" + i_1 + "] = int( mod(float(bcastedIndices[" + (dimOffset + i_1) + "]), " + shape[i_1] + ".0) );\n          ";
                }
                var body = "\n        void " + funcName + " (int bcastedIndices[" + outputRank + "], out int realIndices[" + rank + "]) {\n          " + block + "\n        }\n        ";
                result[funcName] = new glsl_definitions_1.GlslLibRoutine(body);
            }
        });
        return result;
    };
    ShapeUtilsGlslLib.prototype.bcastMatmulIndex = function () {
        var programInfo = this.context.programInfo;
        var outputRank = programInfo.outputLayout.shape.length;
        var result = {};
        this.context.programInfo.samplers.forEach(function (name, i) {
            var shape = programInfo.inputLayouts[i].shape;
            if (!(shape.length < 2 || shape.length > outputRank)) {
                var rank = shape.length;
                var dimOffset = outputRank - rank;
                var funcName = "bcastMatmulIndices_" + name;
                var block = '';
                for (var i_2 = 0; i_2 < rank - 2; ++i_2) {
                    block += "\n          realIndices[" + i_2 + "] = int( mod(float(bcastedIndices[" + (dimOffset + i_2) + "]), " + shape[i_2] + ".0) );\n          ";
                }
                var body = "\n        void " + funcName + "(int bcastedIndices[" + outputRank + "], out int realIndices[" + rank + "]) {\n          " + block + "\n          realIndices[" + (rank - 1) + "] = bcastedIndices[" + (outputRank - 1) + "];\n          realIndices[" + (rank - 2) + "] = bcastedIndices[" + (outputRank - 2) + "];\n        }\n        ";
                result[funcName] = new glsl_definitions_1.GlslLibRoutine(body);
            }
        });
        return result;
    };
    ShapeUtilsGlslLib.prototype.indicesToOffset = function () {
        var programInfo = this.context.programInfo;
        var result = {};
        this.context.programInfo.samplers.forEach(function (name, i) {
            var shape = programInfo.inputLayouts[i].shape;
            var strides = programInfo.inputLayouts[i].strides;
            var rank = shape.length;
            var funcName = "indicesToOffset_" + name;
            result[funcName] = new glsl_definitions_1.GlslLibRoutine(ShapeUtilsGlslLib.indexToOffsetSingle(funcName, rank, strides));
            funcName = "indicesToOffset_" + name + "_T";
            result[funcName] =
                new glsl_definitions_1.GlslLibRoutine(ShapeUtilsGlslLib.indexToOffsetSingle(funcName, rank, strides.slice().reverse()));
        });
        return result;
    };
    ShapeUtilsGlslLib.indexToOffsetSingle = function (name, rank, strides) {
        var block = '';
        for (var i = rank - 1; i >= 0; --i) {
            block += "\n        offset += indices[" + i + "] * " + strides[i] + ";\n        ";
        }
        return "\n      int " + name + "(int indices[" + rank + "]) {\n        int offset = 0;\n        " + block + "\n        return offset;\n      }\n      ";
    };
    ShapeUtilsGlslLib.prototype.offsetToIndices = function () {
        var programInfo = this.context.programInfo;
        var result = {};
        this.context.programInfo.samplers.forEach(function (name, i) {
            var shape = programInfo.inputLayouts[i].shape;
            var strides = programInfo.inputLayouts[i].strides;
            var rank = shape.length;
            var funcName = "offsetToIndices_" + name;
            result[funcName] = new glsl_definitions_1.GlslLibRoutine(ShapeUtilsGlslLib.offsetToIndicesSingle(funcName, rank, strides));
            funcName = "offsetToIndices_" + name + "_T";
            result[funcName] =
                new glsl_definitions_1.GlslLibRoutine(ShapeUtilsGlslLib.offsetToIndicesSingle(funcName, rank, strides.slice().reverse()));
        });
        return result;
    };
    ShapeUtilsGlslLib.offsetToIndicesSingle = function (name, rank, strides) {
        var stridesBlock = [];
        for (var i = 0; i < rank - 1; ++i) {
            stridesBlock.push("\n      indices[" + i + "] = offset / " + strides[i] + ";");
            stridesBlock.push("\n        offset -= indices[" + i + "] * " + strides[i] + ";");
        }
        stridesBlock.push("\n      indices[" + (rank - 1) + "] = offset;");
        return "\n      void " + name + "(int offset, out int indices[" + rank + "]) {\n        " + stridesBlock.join('') + "\n      }\n      ";
    };
    ShapeUtilsGlslLib.prototype.incrementIndices = function () {
        var programInfo = this.context.programInfo;
        var result = {};
        this.context.programInfo.samplers.forEach(function (name, i) {
            var shape = programInfo.inputLayouts[i].shape;
            var rank = shape.length;
            var funcName = "incrementIndices_" + name;
            var shapeInit = '';
            for (var i_3 = 0; i_3 < rank; ++i_3) {
                shapeInit += "\n        shape[" + i_3 + "] = " + shape[i_3] + ";";
            }
            var body = "\n        void " + funcName + "(int axis, out int indices[" + rank + "]) {\n          int shape[" + rank + "];\n          " + shapeInit + ";\n          for(int i = " + rank + " -1 ; i >= 0; --i) {\n            if(i > axis) continue;\n            indices[i] += 1;\n            if(indices[i] < shape[i]) {\n              break;\n            }\n            indices[i] = 0;\n          }\n        }\n        ";
            result[funcName] = new glsl_definitions_1.GlslLibRoutine(body);
        });
        return result;
    };
    return ShapeUtilsGlslLib;
}(glsl_definitions_1.GlslLib));
exports.ShapeUtilsGlslLib = ShapeUtilsGlslLib;
//# sourceMappingURL=glsl-shape-utils-lib.js.map