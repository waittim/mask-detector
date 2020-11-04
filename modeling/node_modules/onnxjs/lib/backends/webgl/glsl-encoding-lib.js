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
exports.EncodingGlslLib = void 0;
var glsl_definitions_1 = require("./glsl-definitions");
/**
 * This GLSL library handles routines converting
 * float32 to/from Unsigned byte or float 16
 */
var EncodingGlslLib = /** @class */ (function (_super) {
    __extends(EncodingGlslLib, _super);
    function EncodingGlslLib(context) {
        return _super.call(this, context) || this;
    }
    EncodingGlslLib.prototype.getFunctions = function () {
        return __assign(__assign({}, this.encodeFloat32()), this.decodeFloat32());
    };
    EncodingGlslLib.prototype.getCustomTypes = function () {
        return {};
    };
    EncodingGlslLib.prototype.encodeFloat32 = function () {
        return {
            encode: new glsl_definitions_1.GlslLibRoutine("highp vec4 encode(highp float f) {\n        return vec4(f, 0.0, 0.0, 0.0);\n      }\n        ")
        };
    };
    EncodingGlslLib.prototype.decodeFloat32 = function () {
        return {
            decode: new glsl_definitions_1.GlslLibRoutine("highp float decode(highp vec4 rgba) {\n        return rgba.r;\n      }\n        ")
        };
    };
    /**
     * returns the routine to encode encode a 32bit float to a vec4 (of unsigned bytes)
     * @credit: https://stackoverflow.com/questions/7059962/how-do-i-convert-a-vec4-rgba-value-to-a-float
     */
    EncodingGlslLib.prototype.encodeUint8 = function () {
        var endianness = EncodingGlslLib.isLittleEndian() ? 'rgba.rgba=rgba.abgr;' : '';
        return {
            encode: new glsl_definitions_1.GlslLibRoutine("\n      highp vec4 encode(highp float f) {\n        highp float F = abs(f);\n        highp float Sign = step(0.0,-f);\n        highp float Exponent = floor(log2(F));\n        highp float Mantissa = (exp2(- Exponent) * F);\n        Exponent = floor(log2(F) + 127.0) + floor(log2(Mantissa));\n        highp vec4 rgba;\n        rgba[0] = 128.0 * Sign  + floor(Exponent*exp2(-1.0));\n        rgba[1] = 128.0 * mod(Exponent,2.0) + mod(floor(Mantissa*128.0),128.0);\n        rgba[2] = floor(mod(floor(Mantissa*exp2(23.0 -8.0)),exp2(8.0)));\n        rgba[3] = floor(exp2(23.0)*mod(Mantissa,exp2(-15.0)));\n        " + endianness + "\n        rgba = rgba / 255.0; // values need to be normalized to [0,1]\n        return rgba;\n    }\n        ")
        };
    };
    /**
     * returns the routine to encode a vec4 of unsigned bytes to float32
     * @credit: https://stackoverflow.com/questions/7059962/how-do-i-convert-a-vec4-rgba-value-to-a-float
     */
    EncodingGlslLib.prototype.decodeUint8 = function () {
        var endianness = EncodingGlslLib.isLittleEndian() ? 'rgba.rgba=rgba.abgr;' : '';
        return {
            decode: new glsl_definitions_1.GlslLibRoutine("\n        highp float decode(highp vec4 rgba) {\n          rgba = rgba * 255.0; // values need to be de-normalized from [0,1] to [0,255]\n          " + endianness + "\n          highp float Sign = 1.0 - step(128.0,rgba[0])*2.0;\n          highp float Exponent = 2.0 * mod(rgba[0],128.0) + step(128.0,rgba[1]) - 127.0;\n          highp float Mantissa = mod(rgba[1],128.0)*65536.0 + rgba[2]*256.0 +rgba[3] + float(0x800000);\n          highp float Result =  Sign * exp2(Exponent) * (Mantissa * exp2(-23.0 ));\n          return Result;\n      }\n        ")
        };
    };
    /**
     * Determines if the machine is little endian or not
     * @credit: https://gist.github.com/TooTallNate/4750953
     */
    EncodingGlslLib.isLittleEndian = function () {
        var b = new ArrayBuffer(4);
        var a = new Uint32Array(b);
        var c = new Uint8Array(b);
        a[0] = 0xdeadbeef;
        if (c[0] === 0xef) {
            return true;
        }
        if (c[0] === 0xde) {
            return false;
        }
        throw new Error('unknown endianness');
    };
    return EncodingGlslLib;
}(glsl_definitions_1.GlslLib));
exports.EncodingGlslLib = EncodingGlslLib;
//# sourceMappingURL=glsl-encoding-lib.js.map