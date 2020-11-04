"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextureManager = void 0;
var instrument_1 = require("../../instrument");
/**
 * TextureManager is the mainly responsible for caching Textures
 * Textures are cached in 2 levels:
 *   1. the texures which are associated with a dataId (from Tensor)
 *    Caching these is crucial to performance. These are In-use Textures
 *   2. textures which are not in use by any current ProgramInfo/Tensor
 *     These are called Free Textures
 * TextureManager is also used to help creating textures. For this it
 * uses WebGLContext and TextureLayoutStrategy
 */
var TextureManager = /** @class */ (function () {
    function TextureManager(glContext, layoutStrategy, profiler, config) {
        this.glContext = glContext;
        this.layoutStrategy = layoutStrategy;
        this.profiler = profiler;
        this.config = config;
        if (config.reuseTextures) {
            this.inUseTextures = new Map();
            this.idleTextures = new Map();
            this.textureLookup = new Map();
        }
    }
    TextureManager.prototype.createTextureFromLayout = function (dataType, layout, data, usage) {
        var textureDataType = this.toEncoderType(dataType);
        var encoder = this.glContext.getEncoder(textureDataType, layout.channels || 1, usage);
        var key;
        var inUseTextures;
        if (this.config.reuseTextures) {
            key = layout.width + "x" + layout.height + "_" + encoder.format + "_" + encoder.internalFormat + "_" + encoder.textureType;
            inUseTextures = this.inUseTextures.get(key);
            if (!inUseTextures) {
                inUseTextures = [];
                this.inUseTextures.set(key, inUseTextures);
            }
            var idleTextures = this.idleTextures.get(key);
            if (idleTextures && idleTextures.length > 0) {
                var texture_1 = idleTextures.pop();
                inUseTextures.push(texture_1);
                if (usage === 1 /* UploadOnly */) {
                    this.glContext.updateTexture(texture_1, layout.width, layout.height, encoder, this.toTextureData(dataType, data));
                }
                return texture_1;
            }
        }
        instrument_1.Logger.verbose('TextureManager', "Creating new texture of size " + layout.width + "x" + layout.height);
        var texture = this.glContext.allocateTexture(layout.width, layout.height, encoder, this.toTextureData(dataType, data));
        if (this.config.reuseTextures) {
            inUseTextures.push(texture);
            this.textureLookup.set(texture, key);
        }
        return texture;
    };
    TextureManager.prototype.readTexture = function (td, dataType, channels) {
        var _this = this;
        if (!channels) {
            channels = 1;
        }
        return this.profiler.event('backend', 'TextureManager.readTexture', function () {
            var dataSize = td.shape.reduce(function (a, b) { return a * b; }) * channels;
            var data = _this.glContext.readTexture(td.texture, td.width, td.height, dataSize, _this.toEncoderType(dataType), channels);
            return _this.toTensorData(dataType, data);
        });
    };
    TextureManager.prototype.readUint8TextureAsFloat = function (td) {
        var _this = this;
        return this.profiler.event('backend', 'TextureManager.readUint8TextureAsFloat', function () {
            var dataSize = td.shape.reduce(function (a, b) { return a * b; });
            var data = _this.glContext.readTexture(td.texture, td.width, td.height, dataSize * 4, 'byte', 4);
            return new Float32Array(data.buffer, data.byteOffset, dataSize);
        });
    };
    TextureManager.prototype.releaseTexture = function (textureData, deleteTexture) {
        var key;
        if (this.config.reuseTextures) {
            key = this.textureLookup.get(textureData.texture);
            if (key) {
                if (deleteTexture) {
                    this.textureLookup.delete(key);
                }
                var inUseTextures = this.inUseTextures.get(key);
                if (inUseTextures) {
                    var index = inUseTextures.indexOf(textureData.texture);
                    if (index !== -1) {
                        inUseTextures.splice(index, 1);
                        var idleTextures = this.idleTextures.get(key);
                        if (!idleTextures) {
                            idleTextures = [];
                            this.idleTextures.set(key, idleTextures);
                        }
                        idleTextures.push(textureData.texture);
                    }
                }
            }
        }
        if (!key || deleteTexture) {
            instrument_1.Logger.verbose('TextureManager', "Deleting texture of size " + textureData.width + "x" + textureData.height);
            this.glContext.deleteTexture(textureData.texture);
        }
    };
    TextureManager.prototype.toTensorData = function (dataType, data) {
        return (data instanceof Float32Array) ? data : new Float32Array(data);
        /*
        switch (dataType) {
          case 'int16':
            return new Int16Array(data);
          case 'int32':
            return new Int32Array(data);
          case 'int8':
            return new Int8Array(data);
          case 'uint16':
            return new Uint16Array(data);
          case 'uint32':
            return data as Uint32Array;
          case 'uint8':
          case 'bool':
            return data as Uint8Array;
          case 'float32':
            return data as Float32Array;
          case 'float64':
            return new Float64Array(data);
          default:
            throw new Error(`TensorData type ${dataType} is not supported`);
        }
        */
    };
    TextureManager.prototype.toTextureData = function (dataType, data) {
        if (!data) {
            return undefined;
        }
        return (data instanceof Float32Array) ? data : new Float32Array(data);
        /*
        switch (dataType) {
          case 'int16':
          case 'int32':
          case 'uint16':
          case 'uint32':
            return (data.constructor === Uint32Array) ? data as Uint32Array : new Uint32Array(data);
          case 'int8':
          case 'uint8':
          case 'bool':
            return (data.constructor === Uint8Array) ? data as Uint8Array : new Uint8Array(data);
          case 'float32':
          case 'float64':
            return (data.constructor === Float32Array) ? data as Float32Array : new Float32Array(data);
          default:
            throw new Error(`TensorData type ${dataType} is not supported`);
        }
        */
    };
    TextureManager.prototype.toEncoderType = function (dataType) {
        return 'float';
        // switch (dataType) {
        //   case 'int16':
        //   case 'int32':
        //   case 'uint16':
        //   case 'uint32':
        //     return 'int';
        //   case 'uint8':
        //   case 'bool':
        //     return 'byte';
        //   case 'float32':
        //   case 'float64':
        //     return 'float';
        //   default:
        //     throw new Error(`TensorData type ${dataType} is not supported`);
        // }
    };
    TextureManager.prototype.clearActiveTextures = function () {
        this.glContext.clearActiveTextures();
    };
    return TextureManager;
}());
exports.TextureManager = TextureManager;
//# sourceMappingURL=texture-manager.js.map