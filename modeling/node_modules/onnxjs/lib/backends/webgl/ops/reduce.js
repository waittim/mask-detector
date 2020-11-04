"use strict";
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
exports.WebGLReduceSumSquare = exports.WebGLReduceLogSum = exports.WebGLReduceProd = exports.WebGLReduceMin = exports.WebGLReduceMax = exports.WebGLReduceMean = exports.WebGLReduceSum = void 0;
var reduce_op_1 = require("../../../ops/reduce-op");
var util_1 = require("../../../util");
var WebGLGenericReduce = /** @class */ (function (_super) {
    __extends(WebGLGenericReduce, _super);
    function WebGLGenericReduce() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WebGLGenericReduce.prototype.run = function (inferenceHandler, inputs) {
        return inferenceHandler.run(this, inputs);
    };
    WebGLGenericReduce.prototype.createProgramInfo = function (handler, inputs) {
        var outputShape = [];
        var iRank = inputs[0].dims.length || 1;
        var idxCopy = []; // copy output indexes to input indexes
        var axes = util_1.ShapeUtil.normalizeAxes(this.axes, inputs[0].dims.length);
        var ops = this.getOps(inputs, axes); // [init ops, reduce ops, final ops]
        var reduceOps = ops[1];
        for (var k = 0; k < inputs[0].dims.length; k++) {
            // if this axis is reduced
            if (axes.indexOf(k) >= 0 || axes.length === 0) {
                if (this.keepDims) {
                    outputShape.push(1);
                } // else { remove the axis from outputShape; }
                // loop over the d-th axis
                reduceOps = "\n        for(int j" + k + " = 0; j" + k + " < " + inputs[0].dims[k] + "; j" + k + "++) {\n          inputIdx[" + k + "] = j" + k + ";\n          " + reduceOps + "\n        }\n        ";
            }
            else {
                idxCopy.push("inputIdx[" + k + "] = outputIdx[" + outputShape.length + "];");
                outputShape.push(inputs[0].dims[k]);
            }
        }
        var oRank = outputShape.length || 1;
        var shaderSource = "\n      float process(int outputIdx[" + oRank + "]) {\n        float value;                 // final result\n        int inputIdx[" + iRank + "];      // addressing input data\n        " + idxCopy.join('\n') + "\n        " + ops[0] + "       // init ops for reduce max/min\n        " + reduceOps + "\n        " + ops[2] + "       // final computation for reduce mean\n        return value;\n      }";
        return {
            inputLayouts: inputs.map(function (t) { return handler.getOrCreateTextureLayout(t); }),
            outputLayout: handler.createTextureLayoutFromShape(outputShape),
            samplers: ['A'],
            shaderSource: shaderSource,
        };
    };
    WebGLGenericReduce.prototype.createRunData = function (handler, programInfo, inputs) {
        var inputTDs = inputs.map(function (t, i) { return handler.getOrCreateTextureData(t, programInfo.inputLayouts[i]); });
        return {
            inputTextureDatas: inputTDs,
            outputTextureData: handler.createTextureDataFromLayout(programInfo.outputLayout, inputTDs[0].tensor.type),
            uniformData: {}
        };
    };
    return WebGLGenericReduce;
}(reduce_op_1.ReduceBase));
var WebGLReduceSum = /** @class */ (function (_super) {
    __extends(WebGLReduceSum, _super);
    function WebGLReduceSum() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WebGLReduceSum.prototype.getOps = function (inputs) {
        return ['value = 0.0;', 'value += _A(inputIdx);', ''];
    };
    return WebGLReduceSum;
}(WebGLGenericReduce));
exports.WebGLReduceSum = WebGLReduceSum;
var WebGLReduceMean = /** @class */ (function (_super) {
    __extends(WebGLReduceMean, _super);
    function WebGLReduceMean() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WebGLReduceMean.prototype.getOps = function (inputs, axes) {
        var size = 1.0;
        for (var k = 0; k < inputs[0].dims.length; k++) {
            if (axes.indexOf(k) >= 0 || axes.length === 0) {
                size *= inputs[0].dims[k];
            }
        }
        return ['value = 0.0;', 'value += _A(inputIdx);', "value /= " + size + ".;"]; // ensure real number with `.`
    };
    return WebGLReduceMean;
}(WebGLGenericReduce));
exports.WebGLReduceMean = WebGLReduceMean;
var WebGLReduceMax = /** @class */ (function (_super) {
    __extends(WebGLReduceMax, _super);
    function WebGLReduceMax() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WebGLReduceMax.prototype.getOps = function (inputs, axes) {
        var idxZero = [];
        for (var k = 0; k < inputs[0].dims.length; k++) {
            if (axes.indexOf(k) >= 0 || axes.length === 0) {
                idxZero.push("inputIdx[" + k + "] = 0;"); // first element
            }
        }
        return [idxZero.join('\n') + "\nvalue = _A(inputIdx);", 'value = max(value, _A(inputIdx));', ''];
    };
    return WebGLReduceMax;
}(WebGLGenericReduce));
exports.WebGLReduceMax = WebGLReduceMax;
var WebGLReduceMin = /** @class */ (function (_super) {
    __extends(WebGLReduceMin, _super);
    function WebGLReduceMin() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WebGLReduceMin.prototype.getOps = function (inputs, axes) {
        var idxZero = [];
        for (var k = 0; k < inputs[0].dims.length; k++) {
            if (axes.indexOf(k) >= 0 || axes.length === 0) {
                idxZero.push("inputIdx[" + k + "] = 0;"); // first element
            }
        }
        return [idxZero.join('\n') + "\nvalue = _A(inputIdx);", 'value = min(value, _A(inputIdx));', ''];
    };
    return WebGLReduceMin;
}(WebGLGenericReduce));
exports.WebGLReduceMin = WebGLReduceMin;
var WebGLReduceProd = /** @class */ (function (_super) {
    __extends(WebGLReduceProd, _super);
    function WebGLReduceProd() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WebGLReduceProd.prototype.getOps = function (inputs) {
        return ['value = 1.0;', 'value *= _A(inputIdx);', ''];
    };
    return WebGLReduceProd;
}(WebGLGenericReduce));
exports.WebGLReduceProd = WebGLReduceProd;
var WebGLReduceLogSum = /** @class */ (function (_super) {
    __extends(WebGLReduceLogSum, _super);
    function WebGLReduceLogSum() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WebGLReduceLogSum.prototype.getOps = function (inputs) {
        return ['value = 0.0;', 'value += _A(inputIdx);', 'value = log(value);'];
    };
    return WebGLReduceLogSum;
}(WebGLGenericReduce));
exports.WebGLReduceLogSum = WebGLReduceLogSum;
var WebGLReduceSumSquare = /** @class */ (function (_super) {
    __extends(WebGLReduceSumSquare, _super);
    function WebGLReduceSumSquare() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WebGLReduceSumSquare.prototype.getOps = function (inputs) {
        return ['float t; value = 0.0;', 't = _A(inputIdx); value += t * t;', ''];
    };
    return WebGLReduceSumSquare;
}(WebGLGenericReduce));
exports.WebGLReduceSumSquare = WebGLReduceSumSquare;
//# sourceMappingURL=reduce.js.map