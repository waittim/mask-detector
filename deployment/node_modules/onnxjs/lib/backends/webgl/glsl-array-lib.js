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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayGlslLib = void 0;
var glsl_definitions_1 = require("./glsl-definitions");
/**
 * This library produces routines needed for non-constant access to uniform arrays
 */
var ArrayGlslLib = /** @class */ (function (_super) {
    __extends(ArrayGlslLib, _super);
    function ArrayGlslLib(context) {
        return _super.call(this, context) || this;
    }
    ArrayGlslLib.prototype.getFunctions = function () {
        return this.generate();
    };
    ArrayGlslLib.prototype.getCustomTypes = function () {
        return {};
    };
    ArrayGlslLib.prototype.generate = function () {
        var result = {};
        for (var i = 1; i <= 16; i++) {
            result["setItem" + i] = new glsl_definitions_1.GlslLibRoutine(this.generateSetItem(i));
            result["getItem" + i] = new glsl_definitions_1.GlslLibRoutine(this.generateGetItem(i));
        }
        return result;
    };
    ArrayGlslLib.prototype.generateSetItem = function (length) {
        var block = "\n       if(index < 0)\n           index = " + length + " + index;\n       if (index == 0)\n           a[0] = value;\n       ";
        for (var i = 1; i < length - 1; ++i) {
            block += "\n       else if (index == " + i + ")\n           a[" + i + "] = value;\n           ";
        }
        block += "\n       else\n           a[" + (length - 1) + "] = value;\n       ";
        var body = "\n     void setItem" + length + "(out float a[" + length + "], int index, float value) {\n       " + block + "\n     }\n       ";
        return body;
    };
    ArrayGlslLib.prototype.generateGetItem = function (length) {
        var block = "\n       if(index < 0)\n           index = " + length + " + index;\n       if (index == 0)\n           return a[0];\n     ";
        for (var i = 1; i < length - 1; ++i) {
            block += "\n       else if (index == " + i + ")\n           return a[" + i + "];\n     ";
        }
        block += "\n       else\n           return a[" + (length - 1) + "];\n       ";
        var body = "\n     float getItem" + length + "(float a[" + length + "], int index) {\n       " + block + "\n     }\n   ";
        return body;
    };
    return ArrayGlslLib;
}(glsl_definitions_1.GlslLib));
exports.ArrayGlslLib = ArrayGlslLib;
//# sourceMappingURL=glsl-array-lib.js.map