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
exports.tanh = exports.tan = exports.sqrt = exports.sinh = exports.sin = exports.sign = exports.sigmoid = exports.relu = exports.reciprocal = exports.not = exports.neg = exports.log = exports.leakyRelu = exports.leakyReluInitializer = exports.isNan = exports.floor = exports.exp = exports.elu = exports.eluInitializer = exports.cosh = exports.cos = exports.clip = exports.clipInitializer = exports.ceil = exports.atanh = exports.atan = exports.asinh = exports.asin = exports.acosh = exports.acos = exports.abs = exports.unaryOp = exports.CpuUnaryOp = void 0;
var unary_op_1 = require("../../../ops/unary-op");
var tensor_1 = require("../../../tensor");
var CpuUnaryOp = /** @class */ (function (_super) {
    __extends(CpuUnaryOp, _super);
    function CpuUnaryOp(typeConstraint, func, attributesInitializer, resultType) {
        var _this = _super.call(this, typeConstraint, resultType) || this;
        _this.func = func;
        _this.attributesInitializer = attributesInitializer;
        return _this;
    }
    CpuUnaryOp.prototype.initialize = function (attributes) {
        if (this.attributesInitializer) {
            this.attributes = this.attributesInitializer(attributes);
        }
    };
    CpuUnaryOp.prototype.run = function (inferenceHandler, inputs) {
        // TODO:  use webpack + ts-loader + CustomTransformer
        // tslint:disable-next-line:max-line-length
        // https://github.com/TypeStrong/ts-loader#getcustomtransformers-----before-transformerfactory-after-transformerfactory--
        var output = unaryOp(inputs[0], this.func, this.attributes, this.resultType);
        return [output];
    };
    return CpuUnaryOp;
}(unary_op_1.UnaryOp));
exports.CpuUnaryOp = CpuUnaryOp;
function unaryOp(x, func, attributes, resultType) {
    var output = new tensor_1.Tensor(x.dims, resultType ? resultType : x.type);
    var inputNumberData = x.data;
    var outputNumberData = output.data;
    func(inputNumberData, outputNumberData, attributes);
    return output;
}
exports.unaryOp = unaryOp;
// specific implementations pertaining to each unary-op.
// although this can be accomplished with an op lambda
// that approach was found to be detrimental to performance
// so we use this approach which involves slight code duplication
function abs(input, output) {
    for (var i = 0; i < input.length; i++) {
        output[i] = Math.abs(input[i]);
    }
}
exports.abs = abs;
function acos(input, output) {
    for (var i = 0; i < input.length; i++) {
        output[i] = Math.acos(input[i]);
    }
}
exports.acos = acos;
function acosh(input, output) {
    for (var i = 0; i < input.length; i++) {
        output[i] = Math.acosh(input[i]);
    }
}
exports.acosh = acosh;
function asin(input, output) {
    for (var i = 0; i < input.length; i++) {
        output[i] = Math.asin(input[i]);
    }
}
exports.asin = asin;
function asinh(input, output) {
    for (var i = 0; i < input.length; i++) {
        output[i] = Math.asinh(input[i]);
    }
}
exports.asinh = asinh;
function atan(input, output) {
    for (var i = 0; i < input.length; i++) {
        output[i] = Math.atan(input[i]);
    }
}
exports.atan = atan;
function atanh(input, output) {
    for (var i = 0; i < input.length; i++) {
        output[i] = Math.atanh(input[i]);
    }
}
exports.atanh = atanh;
function ceil(input, output) {
    for (var i = 0; i < input.length; i++) {
        output[i] = Math.ceil(input[i]);
    }
}
exports.ceil = ceil;
function clipInitializer(attributes) {
    return {
        min: attributes.getFloat('min', -3.4028234663852886e+38),
        max: attributes.getFloat('max', 3.4028234663852886e+38)
    };
}
exports.clipInitializer = clipInitializer;
function clip(input, output, attributes) {
    var min = attributes.min;
    var max = attributes.max;
    for (var i = 0; i < input.length; i++) {
        var value = input[i];
        output[i] = (value < min) ? min : (value > max) ? max : value;
    }
}
exports.clip = clip;
function cos(input, output) {
    for (var i = 0; i < input.length; i++) {
        output[i] = Math.cos(input[i]);
    }
}
exports.cos = cos;
function cosh(input, output) {
    for (var i = 0; i < input.length; i++) {
        output[i] = Math.cosh(input[i]);
    }
}
exports.cosh = cosh;
function eluInitializer(attributes) {
    return attributes.getFloat('alpha', 1.0);
}
exports.eluInitializer = eluInitializer;
function elu(input, output, attributes) {
    var alpha = attributes;
    for (var i = 0; i < input.length; i++) {
        var value = input[i];
        output[i] = value >= 0 ? value : alpha * (Math.exp(value) - 1.0);
    }
}
exports.elu = elu;
function exp(input, output) {
    for (var i = 0; i < input.length; i++) {
        output[i] = Math.exp(input[i]);
    }
}
exports.exp = exp;
function floor(input, output) {
    for (var i = 0; i < input.length; i++) {
        output[i] = Math.floor(input[i]);
    }
}
exports.floor = floor;
function isNan(input, output) {
    for (var i = 0; i < input.length; i++) {
        output[i] = Number.isNaN(input[i]) ? 1 : 0;
    }
}
exports.isNan = isNan;
function leakyReluInitializer(attributes) {
    return attributes.getFloat('alpha', 0.01);
}
exports.leakyReluInitializer = leakyReluInitializer;
function leakyRelu(input, output, attributes) {
    var alpha = attributes;
    for (var i = 0; i < input.length; i++) {
        var value = input[i];
        output[i] = value >= 0 ? value : alpha * value;
    }
}
exports.leakyRelu = leakyRelu;
function log(input, output) {
    for (var i = 0; i < input.length; i++) {
        output[i] = Math.log(input[i]);
    }
}
exports.log = log;
function neg(input, output) {
    for (var i = 0; i < input.length; i++) {
        output[i] = -input[i];
    }
}
exports.neg = neg;
function not(input, output) {
    for (var i = 0; i < input.length; i++) {
        output[i] = input[i] ? 0 : 1;
    }
}
exports.not = not;
function reciprocal(input, output) {
    for (var i = 0; i < input.length; i++) {
        output[i] = 1.0 / input[i];
    }
}
exports.reciprocal = reciprocal;
function relu(input, output) {
    for (var i = 0; i < input.length; i++) {
        output[i] = Math.max(0, input[i]);
    }
}
exports.relu = relu;
function sigmoid(input, output) {
    for (var i = 0; i < input.length; i++) {
        output[i] = (1 / (1 + Math.exp(-input[i])));
    }
}
exports.sigmoid = sigmoid;
function sign(input, output) {
    for (var i = 0; i < input.length; i++) {
        output[i] = input[i] > 0 ? 1 : input[i] < 0 ? -1 : 0;
    }
}
exports.sign = sign;
function sin(input, output) {
    for (var i = 0; i < input.length; i++) {
        output[i] = Math.sin(input[i]);
    }
}
exports.sin = sin;
function sinh(input, output) {
    for (var i = 0; i < input.length; i++) {
        output[i] = Math.sinh(input[i]);
    }
}
exports.sinh = sinh;
function sqrt(input, output) {
    for (var i = 0; i < input.length; i++) {
        output[i] = Math.sqrt(input[i]);
    }
}
exports.sqrt = sqrt;
function tan(input, output) {
    for (var i = 0; i < input.length; i++) {
        output[i] = Math.tan(input[i]);
    }
}
exports.tan = tan;
function tanh(input, output) {
    for (var i = 0; i < input.length; i++) {
        output[i] = Math.tanh(input[i]);
    }
}
exports.tanh = tanh;
//# sourceMappingURL=unary-op.js.map