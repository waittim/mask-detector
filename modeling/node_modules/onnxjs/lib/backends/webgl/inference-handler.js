"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebGLInferenceHandler = void 0;
var instrument_1 = require("../../instrument");
var tensor_1 = require("../../tensor");
var util_1 = require("../../util");
var uint8_encode_1 = require("./ops/uint8-encode");
var utils_1 = require("./utils");
var WebGLInferenceHandler = /** @class */ (function () {
    function WebGLInferenceHandler(session) {
        this.session = session;
        this.textureDataCache = new Map();
    }
    WebGLInferenceHandler.prototype.run = function (op, inputs) {
        var artifact = this.session.programManager.getArtifact(op);
        if (!artifact) {
            var programInfo = op.createProgramInfo(this, inputs);
            artifact = this.session.programManager.build(programInfo);
            this.session.programManager.setArtifact(op, artifact);
        }
        var runData = op.createRunData(this, artifact.programInfo, inputs);
        this.session.programManager.run(artifact, runData);
        return [runData.outputTextureData.tensor];
    };
    /**
     * Create a TextureData object from a tensor.
     * Usage = Encoder.Usage.UploadOnly.
     * If a related texture data is found in cache, returns it;
     * Otherwise:
     *   Creates a new texture layout if not provided;
     *   Creates WebGLTexture with the layout;
     *   Upload tensor data to the texture;
     *   Creates a texture data object associated with the given tensor.
     * @param tensor the tensor with data to upload
     */
    WebGLInferenceHandler.prototype.getOrCreateTextureData = function (tensor, layout) {
        var td = this.getTextureData(tensor.dataId);
        if (!td) {
            instrument_1.Logger.verbose('InferenceHandler', "Creating new TextureData for dims: [" + tensor.dims + "]");
            if (!layout) {
                layout = this.createTextureLayoutFromShape(tensor.dims.slice());
            }
            // graph inputs or initializers
            td = this.createTextureData(layout, tensor.type, tensor.numberData, tensor, 1 /* UploadOnly */);
        }
        else {
            instrument_1.Logger.verbose('InferenceHandler', "Retrieving TextureData from cache: [" + tensor.dims + "]");
        }
        return td;
    };
    /**
     * Create a TextureData object from the given data type and texture layout.
     * Usage = Encoder.Usage.Default.
     * @param dataType the tensor data type
     */
    WebGLInferenceHandler.prototype.createTextureDataFromLayout = function (layout, dataType) {
        return this.createTextureData(layout, dataType);
    };
    /**
     * Create a TextureData object using the given data and bind to the given tensor.
     * Usage = Encoder.Usage.UploadOnly.
     * NOTE: this function is a hack for Conv implementation. should remove this function, after rewriting Conv
     * implementation by Graph.Transformer
     * @param dataType the tensor data type
     * @param data the actual data to upload
     * @param tensor the tensor to bind. tensor's data is ignored.
     */
    WebGLInferenceHandler.prototype.createTextureDataFromLayoutBindTensor = function (layout, dataType, data, tensor) {
        return this.createTextureData(layout, dataType, data, tensor, 1 /* UploadOnly */);
    };
    WebGLInferenceHandler.prototype.createTextureData = function (layout, dataType, data, tensor, usage) {
        instrument_1.Logger.verbose('InferenceHandler', "Creating TextureData: layout:[" + JSON.stringify(layout) + "]");
        var texture = this.session.textureManager.createTextureFromLayout(dataType, layout, data, usage);
        return this.createTextureDataFromTexture(layout, dataType, texture, tensor);
    };
    /**
     * Create a TextureData object, using the given texture.
     * This function does not create new texture. Usually used in scenarios using texture sharing. (eg. Reshape)
     * @param dataType the tensor data type
     * @param texture the WebGLTexture object to share
     * @param tensorId the tensor ID of the shared tensor data
     */
    WebGLInferenceHandler.prototype.createSharedTextureData = function (layout, dataType, texture, tensorId) {
        return this.createTextureDataFromTexture(layout, dataType, texture, undefined, tensorId);
    };
    WebGLInferenceHandler.prototype.createTextureDataFromTexture = function (layout, dataType, texture, tensor, tensorId) {
        var _this = this;
        var textureData = __assign(__assign({}, layout), { tensor: tensor ||
                new tensor_1.Tensor(layout.unpackedShape, dataType, function (id) {
                    return _this.readTexture(textureData);
                }, undefined, undefined, tensorId), texture: texture });
        this.setTextureData(textureData.tensor.dataId, textureData);
        return textureData;
    };
    WebGLInferenceHandler.prototype.getTextureData = function (tensorId) {
        return this.session.isInitializer(tensorId) ? this.session.getTextureData(tensorId) :
            this.textureDataCache.get(tensorId);
    };
    WebGLInferenceHandler.prototype.setTextureData = function (tensorId, td) {
        if (this.session.isInitializer(tensorId)) {
            this.session.setTextureData(tensorId, td);
        }
        else {
            this.textureDataCache.set(tensorId, td);
        }
    };
    /**
     * Create a TextureLayout object from a tensor. If a related texture data is found, returns the cached texture layout.
     */
    WebGLInferenceHandler.prototype.getOrCreateTextureLayout = function (tensor, channels, unpackedShape) {
        if (channels === void 0) { channels = 1; }
        var td = this.getTextureData(tensor.dataId);
        if (td) {
            return td;
        }
        return this.createTextureLayoutFromShape(channels === 1 ? tensor.dims.slice() : utils_1.getPackedShape(tensor.dims.slice()), channels, unpackedShape);
    };
    /**
     * Create a TextureLayout object from shape.
     */
    WebGLInferenceHandler.prototype.createTextureLayoutFromShape = function (shape, channels, unpackedShape, prefs) {
        if (channels === void 0) { channels = 1; }
        var _a = __read(this.session.layoutStrategy.computeTextureWH(shape, prefs), 2), width = _a[0], height = _a[1];
        var inferredDims = shape;
        if (shape.length === 0) {
            inferredDims = [1];
        }
        if (channels === 1) {
            // unpackedShape will take `shape` and not `inferredDims` so as to create a scalar Tensor if need be
            unpackedShape = shape;
        }
        else if (!unpackedShape) {
            throw new Error('Unpacked shape is needed when using channels > 1');
        }
        return {
            width: width,
            height: height,
            channels: channels ? channels : 1,
            shape: inferredDims,
            strides: util_1.ShapeUtil.computeStrides(inferredDims),
            unpackedShape: unpackedShape
        };
    };
    WebGLInferenceHandler.prototype.dispose = function () {
        var _this = this;
        this.session.textureManager.clearActiveTextures();
        this.textureDataCache.forEach(function (td) { return _this.session.textureManager.releaseTexture(td); });
        this.textureDataCache = new Map();
    };
    WebGLInferenceHandler.prototype.readTexture = function (textureData) {
        if (!this.session.backend.glContext.isFloat32DownloadSupported) {
            var op = new uint8_encode_1.WebGLUint8Encode();
            var uint8TD = op.runInternal(this, textureData);
            return this.session.textureManager.readUint8TextureAsFloat(uint8TD);
        }
        return this.session.textureManager.readTexture(textureData, textureData.tensor.type, textureData.channels);
    };
    return WebGLInferenceHandler;
}());
exports.WebGLInferenceHandler = WebGLInferenceHandler;
//# sourceMappingURL=inference-handler.js.map