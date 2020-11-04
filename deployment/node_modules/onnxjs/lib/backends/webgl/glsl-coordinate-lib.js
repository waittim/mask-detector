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
exports.CoordsGlslLib = void 0;
var glsl_definitions_1 = require("./glsl-definitions");
var glsl_source_1 = require("./glsl-source");
/**
 * GLSL Library responsible for data types and routines for manipulating
 * coordinates and mapping to/from tensor indices
 */
var CoordsGlslLib = /** @class */ (function (_super) {
    __extends(CoordsGlslLib, _super);
    function CoordsGlslLib(context) {
        return _super.call(this, context) || this;
    }
    CoordsGlslLib.prototype.getFunctions = function () {
        return __assign(__assign(__assign(__assign({}, this.offsetToCoords()), this.coordsToOffset()), this.toVec()), this.valueFrom());
    };
    CoordsGlslLib.prototype.getCustomTypes = function () {
        return {};
    };
    /**
     * Produces a function that can map from
     * 2D normalzied coordinates (s,t) to a flat offset
     */
    CoordsGlslLib.prototype.offsetToCoords = function () {
        var funcName = "offsetToCoords";
        return {
            offsetToCoords: new glsl_definitions_1.GlslLibRoutine("\n      vec2 " + funcName + "(int offset, int width, int height) {\n        int t = offset / width;\n        int s = offset - t*width;\n        vec2 coords = (vec2(s,t) + vec2(0.5,0.5)) / vec2(width, height);\n        return coords;\n      }\n      ")
        };
    };
    /**
     * Produces a function that can map from
     * 2D normalzied coordinates (s,t) to a flat offset
     */
    CoordsGlslLib.prototype.coordsToOffset = function () {
        var funcName = "coordsToOffset";
        return {
            coordsToOffset: new glsl_definitions_1.GlslLibRoutine("\n      int " + funcName + "(vec2 coords, int width, int height) {\n        float s = coords.s * float(width);\n        float t = coords.t * float(height);\n        int offset = int(t) * width + int(s);\n        return offset;\n      }\n      ")
        };
    };
    /**
     * This is the main function to map from the given texture coordiantes (s,t)
     * to logical indices for the output
     * There will only be one single variation of this
     * Also see coordsToOffset and offsetToIndices for input-specific versions
     */
    CoordsGlslLib.prototype.toVec = function () {
        var output = this.context.programInfo.outputLayout;
        var rank = output.shape.length;
        var strides = output.strides;
        var xScale = output.width;
        var yScale = output.height;
        var stridesBlock = [];
        for (var i = 0; i < rank - 1; ++i) {
            stridesBlock.push("\n        c[" + i + "] = offset / " + strides[i] + ";");
            stridesBlock.push("\n        offset -= c[" + i + "] * " + strides[i] + ";");
        }
        stridesBlock.push("\n        c[" + (rank - 1) + "] = offset;");
        var body = "\n      void toVec(vec2 texCoords, out int c[" + rank + "]) {\n        int offset = coordsToOffset(texCoords, " + xScale + ", " + yScale + ");\n        " + stridesBlock.join('') + "\n      }\n      void toVec(int offset, out int c[" + rank + "]) {\n        " + stridesBlock.join('') + "\n      }\n    ";
        return { toVec: new glsl_definitions_1.GlslLibRoutine(body, ['coordinates.coordsToOffset']) };
    };
    /**
     * These are value getter functions generated for each input
     * Each function is hardwired to the name and dimensions of the input
     * An '_T' variation is also produced which accesses values as if the
     * input was transposed
     */
    CoordsGlslLib.prototype.valueFrom = function () {
        var _this = this;
        var programInfo = this.context.programInfo;
        var result = {};
        this.context.programInfo.samplers.forEach(function (name, i) {
            var layout = programInfo.inputLayouts[i];
            var shape = layout.shape;
            var rank = shape.length;
            var funcName = "_" + name;
            result[funcName] = new glsl_definitions_1.GlslLibRoutine(_this.getValueFromSingle(name, rank, layout.width, layout.height, false), ["shapeUtils.indicesToOffset" + funcName, "coordinates.offsetToCoords", "fragcolor.getColorAsFloat"]);
            funcName = funcName + '_T';
            result[funcName] = new glsl_definitions_1.GlslLibRoutine(_this.getValueFromSingle(name, rank, layout.width, layout.height, true), ["shapeUtils.indicesToOffset" + funcName, "coordinates.offsetToCoords", "fragcolor.getColorAsFloat"]);
        });
        return result;
    };
    /**
     * Produces one value getter function for the name and rank given
     * If a transpose is set proper offsetToCoords mapping will be used
     * @param name name of the function
     * @param rank rank of the input
     * @param transpose whether or not should generate a transpose variation
     */
    CoordsGlslLib.prototype.getValueFromSingle = function (varName, rank, width, height, transpose) {
        var name = "_" + varName;
        if (transpose) {
            name = name + '_T';
        }
        var glsl = glsl_source_1.getGlsl(this.context.glContext.version);
        return "\n        float " + name + "(int m[" + rank + "]) {\n          int offset = indicesToOffset" + name + "(m);\n          vec2 coords = offsetToCoords(offset, " + width + ", " + height + ");\n          float value = getColorAsFloat(" + glsl.texture2D + "(" + varName + ", coords));\n          return value;\n        }\n        ";
    };
    return CoordsGlslLib;
}(glsl_definitions_1.GlslLib));
exports.CoordsGlslLib = CoordsGlslLib;
//# sourceMappingURL=glsl-coordinate-lib.js.map