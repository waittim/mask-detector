"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Uint8DataEncoder = exports.RGBAFloatDataEncoder = exports.RedFloat32DataEncoder = void 0;
var instrument_1 = require("../../instrument");
/**
 * WebGL2 data encoder
 * Uses R32F as the format for texlet
 */
var RedFloat32DataEncoder = /** @class */ (function () {
    function RedFloat32DataEncoder(gl, channels) {
        if (channels === void 0) { channels = 1; }
        if (channels === 1) {
            this.internalFormat = gl.R32F;
            this.format = gl.RED;
            this.textureType = gl.FLOAT;
            this.channelSize = channels;
        }
        else if (channels === 4) {
            this.internalFormat = gl.RGBA32F;
            this.format = gl.RGBA;
            this.textureType = gl.FLOAT;
            this.channelSize = channels;
        }
        else {
            throw new Error("Invalid number of channels: " + channels);
        }
    }
    RedFloat32DataEncoder.prototype.encode = function (src, textureSize) {
        var result;
        var source;
        if (src.constructor !== Float32Array) {
            instrument_1.Logger.warning('Encoder', 'data was not of type Float32; creating new Float32Array');
            source = new Float32Array(src);
        }
        if (textureSize * this.channelSize > src.length) {
            instrument_1.Logger.warning('Encoder', 'Source data too small. Allocating larger array');
            source = src;
            result = this.allocate(textureSize * this.channelSize);
            source.forEach(function (v, i) { return result[i] = v; });
        }
        else {
            source = src;
            result = source;
        }
        return result;
    };
    RedFloat32DataEncoder.prototype.allocate = function (size) {
        return new Float32Array(size * 4);
    };
    RedFloat32DataEncoder.prototype.decode = function (buffer, dataSize) {
        if (this.channelSize === 1) {
            var filteredData = buffer.filter(function (value, index) { return index % 4 === 0; }).subarray(0, dataSize);
            return filteredData;
        }
        return buffer.subarray(0, dataSize);
    };
    return RedFloat32DataEncoder;
}());
exports.RedFloat32DataEncoder = RedFloat32DataEncoder;
/**
 * Data encoder for WebGL 1 with support for floating point texture
 */
var RGBAFloatDataEncoder = /** @class */ (function () {
    function RGBAFloatDataEncoder(gl, channels, textureType) {
        if (channels === void 0) { channels = 1; }
        if (channels !== 1 && channels !== 4) {
            throw new Error("Invalid number of channels: " + channels);
        }
        this.internalFormat = gl.RGBA;
        this.format = gl.RGBA;
        this.channelSize = channels;
        this.textureType = textureType || gl.FLOAT;
    }
    RGBAFloatDataEncoder.prototype.encode = function (src, textureSize) {
        var dest = src;
        if (this.channelSize === 1) {
            instrument_1.Logger.verbose('Encoder', 'Exploding into a larger array');
            dest = this.allocate(textureSize);
            src.forEach(function (v, i) { return dest[i * 4] = v; });
        }
        return dest;
    };
    RGBAFloatDataEncoder.prototype.allocate = function (size) {
        return new Float32Array(size * 4);
    };
    RGBAFloatDataEncoder.prototype.decode = function (buffer, dataSize) {
        if (this.channelSize === 1) {
            var filteredData = buffer.filter(function (value, index) { return index % 4 === 0; }).subarray(0, dataSize);
            return filteredData;
        }
        return buffer.subarray(0, dataSize);
    };
    return RGBAFloatDataEncoder;
}());
exports.RGBAFloatDataEncoder = RGBAFloatDataEncoder;
var Uint8DataEncoder = /** @class */ (function () {
    function Uint8DataEncoder(gl, channels) {
        if (channels === void 0) { channels = 1; }
        this.channelSize = 4;
        if (channels === 1) {
            this.internalFormat = gl.ALPHA;
            this.format = gl.ALPHA; // not tested
            this.textureType = gl.UNSIGNED_BYTE;
            this.channelSize = channels;
        }
        else if (channels === 4) {
            this.internalFormat = gl.RGBA;
            this.format = gl.RGBA;
            this.textureType = gl.UNSIGNED_BYTE;
            this.channelSize = channels;
        }
        else {
            throw new Error("Invalid number of channels: " + channels);
        }
    }
    Uint8DataEncoder.prototype.encode = function (src, textureSize) {
        return new Uint8Array(src.buffer, src.byteOffset, src.byteLength);
    };
    Uint8DataEncoder.prototype.allocate = function (size) {
        return new Uint8Array(size * this.channelSize);
    };
    Uint8DataEncoder.prototype.decode = function (buffer, dataSize) {
        if (buffer instanceof Uint8Array) {
            return buffer.subarray(0, dataSize);
        }
        throw new Error("Invalid array type: " + buffer.constructor);
    };
    return Uint8DataEncoder;
}());
exports.Uint8DataEncoder = Uint8DataEncoder;
//# sourceMappingURL=texture-data-encoder.js.map