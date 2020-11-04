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
exports.VecGlslLib = void 0;
var glsl_definitions_1 = require("./glsl-definitions");
/**
 * GLSL Library responsible for vec routines
 * Vec is an varible length int array. The length is fixed at the time of
 * generating the library functions from the dimensions of the output.
 */
var VecGlslLib = /** @class */ (function (_super) {
    __extends(VecGlslLib, _super);
    function VecGlslLib(context) {
        return _super.call(this, context) || this;
    }
    VecGlslLib.prototype.getCustomTypes = function () {
        return {};
    };
    VecGlslLib.prototype.getFunctions = function () {
        return __assign(__assign(__assign(__assign({}, this.binaryVecFunctions()), this.copyVec()), this.setVecItem()), this.getVecItem());
    };
    VecGlslLib.prototype.binaryVecFunctions = function () {
        var outputLayout = this.context.programInfo.outputLayout;
        var rank = outputLayout.shape.length;
        var nameOp = { add: '+=', sub: '-=', mul: '*=', div: '/=' };
        var result = {};
        for (var name_1 in nameOp) {
            var fname = name_1 + "Vec";
            var assignmentBlock = '';
            for (var i = 0; i < rank; ++i) {
                assignmentBlock += "\n          dest[" + i + "] " + nameOp[name_1] + " src[" + i + "];\n          ";
            }
            var body = "\n        void " + fname + "(int src[" + rank + "], out int dest[" + rank + "]) {\n          " + assignmentBlock + "\n        }\n        ";
            result[fname] = new glsl_definitions_1.GlslLibRoutine(body);
        }
        return result;
    };
    VecGlslLib.prototype.copyVec = function () {
        var outputLayout = this.context.programInfo.outputLayout;
        var rank = outputLayout.shape.length;
        var assignmentBlock = '';
        for (var i = 0; i < rank; ++i) {
            assignmentBlock += "\n        dest[" + i + "] = src[" + i + "];\n        ";
        }
        var body = "\n      void copyVec(int src[" + rank + "], out int dest[" + rank + "]) {\n        " + assignmentBlock + "\n      }\n      ";
        return { copyVec: new glsl_definitions_1.GlslLibRoutine(body) };
    };
    VecGlslLib.prototype.setVecItem = function () {
        var outputLayout = this.context.programInfo.outputLayout;
        var rank = outputLayout.shape.length;
        var block = "\n        if(index < 0)\n            index =" + rank + " + index;\n        if (index == 0)\n            m[0] = value;\n        ";
        for (var i = 1; i < rank - 1; ++i) {
            block += "\n        else if (index == " + i + ")\n            m[" + i + "] = value;\n            ";
        }
        block += "\n        else\n            m[" + (rank - 1) + "] = value;\n        ";
        var body = "\n      void setVecItem(out int m[" + rank + "], int index, int value) {\n        " + block + "\n      }\n        ";
        return { setVecItem: new glsl_definitions_1.GlslLibRoutine(body) };
    };
    VecGlslLib.prototype.getVecItem = function () {
        var outputLayout = this.context.programInfo.outputLayout;
        var rank = outputLayout.shape.length;
        var block = "\n        if(index < 0)\n            index = " + rank + " + index;\n        if (index == 0)\n            return m[0];\n      ";
        for (var i = 1; i < rank - 1; ++i) {
            block += "\n        else if (index == " + i + ")\n            return m[" + i + "];\n      ";
        }
        block += "\n        else\n            return m[" + (rank - 1) + "];\n        ";
        var body = "\n      int getVecItem(int m[" + rank + "], int index) {\n        " + block + "\n      }\n    ";
        return { getVecItem: new glsl_definitions_1.GlslLibRoutine(body) };
    };
    return VecGlslLib;
}(glsl_definitions_1.GlslLib));
exports.VecGlslLib = VecGlslLib;
//# sourceMappingURL=glsl-vec-lib.js.map