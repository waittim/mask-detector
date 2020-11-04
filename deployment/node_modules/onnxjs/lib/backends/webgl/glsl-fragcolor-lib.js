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
exports.FragColorGlslLib = void 0;
var glsl_definitions_1 = require("./glsl-definitions");
var glsl_source_1 = require("./glsl-source");
/**
 * This GLSL library handles routines around reading a texlet and writing to it
 * Reading and writing could be more than just dealing with one channel
 * It may require encoding/decoding to/from 4 channels into one
 */
var FragColorGlslLib = /** @class */ (function (_super) {
    __extends(FragColorGlslLib, _super);
    function FragColorGlslLib(context) {
        return _super.call(this, context) || this;
    }
    FragColorGlslLib.prototype.getFunctions = function () {
        return __assign(__assign({}, this.setFragColor()), this.getColorAsFloat());
    };
    FragColorGlslLib.prototype.getCustomTypes = function () {
        return {};
    };
    FragColorGlslLib.prototype.setFragColor = function () {
        var glsl = glsl_source_1.getGlsl(this.context.glContext.version);
        return {
            setFragColor: new glsl_definitions_1.GlslLibRoutine("\n        void setFragColor(float value) {\n            " + glsl.output + " = encode(value);\n        }\n        ", ['encoding.encode'])
        };
    };
    FragColorGlslLib.prototype.getColorAsFloat = function () {
        return {
            getColorAsFloat: new glsl_definitions_1.GlslLibRoutine("\n        float getColorAsFloat(vec4 color) {\n            return decode(color);\n        }\n        ", ['encoding.decode'])
        };
    };
    return FragColorGlslLib;
}(glsl_definitions_1.GlslLib));
exports.FragColorGlslLib = FragColorGlslLib;
//# sourceMappingURL=glsl-fragcolor-lib.js.map