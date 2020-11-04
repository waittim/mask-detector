"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
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
exports.WebGLUint8Encode = void 0;
var util_1 = require("../../../util");
var glsl_source_1 = require("../glsl-source");
var WebGLUint8Encode = /** @class */ (function () {
    function WebGLUint8Encode() {
    }
    WebGLUint8Encode.prototype.runInternal = function (inferenceHandler, input) {
        var outputShape = input.shape;
        var _a = __read(inferenceHandler.session.layoutStrategy.computeTextureWH(input.shape), 2), width = _a[0], height = _a[1];
        var outputLayout = {
            width: width,
            height: height,
            channels: 4,
            shape: outputShape,
            strides: util_1.ShapeUtil.computeStrides(outputShape),
            unpackedShape: outputShape
        };
        var glsl = glsl_source_1.getGlsl(inferenceHandler.session.backend.glContext.version);
        // TODO: remove this special script. Use graph transformer instead.
        /**
         * https://github.com/tensorflow/tfjs-core/blob/master/src/kernels/webgl/encode_float_gpu.ts
         */
        var shaderSource = "\n      const float FLOAT_MAX = 1.70141184e38;\n      const float FLOAT_MIN = 1.17549435e-38;\n\n      bool isNaN(float val) {\n        return (val < 1.0 || 0.0 < val || val == 0.0) ? false : true;\n      }\n\n      highp vec4 encodeAsUint8(highp float v) {\n        if (isNaN(v)) {\n          return vec4(255, 255, 255, 255);\n        }\n\n        highp float av = abs(v);\n\n        if(av < FLOAT_MIN) {\n          return vec4(0.0, 0.0, 0.0, 0.0);\n        } else if(v > FLOAT_MAX) {\n          return vec4(0.0, 0.0, 128.0, 127.0) / 255.0;\n        } else if(v < -FLOAT_MAX) {\n          return vec4(0.0, 0.0,  128.0, 255.0) / 255.0;\n        }\n\n        highp vec4 c = vec4(0,0,0,0);\n\n        highp float e = floor(log2(av));\n        highp float m = exp2(fract(log2(av))) - 1.0;\n\n        c[2] = floor(128.0 * m);\n        m -= c[2] / 128.0;\n        c[1] = floor(32768.0 * m);\n        m -= c[1] / 32768.0;\n        c[0] = floor(8388608.0 * m);\n\n        highp float ebias = e + 127.0;\n        c[3] = floor(ebias / 2.0);\n        ebias -= c[3] * 2.0;\n        c[2] += floor(ebias) * 128.0;\n\n        c[3] += 128.0 * step(0.0, -v);\n\n        return c / 255.0;\n      }\n\n      void main() {\n        float value = " + glsl.texture2D + "(X,TexCoords).r;\n        " + glsl.output + " = encodeAsUint8(value);\n      }";
        var programInfo = { inputLayouts: [input], outputLayout: outputLayout, samplers: ['X'], shaderSource: shaderSource, hasMain: true };
        var artifact = inferenceHandler.session.programManager.build(programInfo);
        var encoder = inferenceHandler.session.backend.glContext.getEncoder('byte', 4);
        var texture = inferenceHandler.session.backend.glContext.allocateTexture(outputLayout.width, outputLayout.height, encoder);
        var outputTextureData = inferenceHandler.createSharedTextureData(outputLayout, 'uint8', texture, {});
        var runData = { inputTextureDatas: [input], outputTextureData: outputTextureData, uniformData: {} };
        inferenceHandler.session.programManager.run(artifact, runData);
        return runData.outputTextureData;
    };
    return WebGLUint8Encode;
}());
exports.WebGLUint8Encode = WebGLUint8Encode;
//# sourceMappingURL=uint8-encode.js.map