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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.concat = exports.CpuConcat = void 0;
var concat_1 = require("../../../ops/concat");
var tensor_1 = require("../../../tensor");
var Util = __importStar(require("../../../util"));
var CpuConcat = /** @class */ (function (_super) {
    __extends(CpuConcat, _super);
    function CpuConcat() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CpuConcat.prototype.run = function (inferenceHandler, inputs) {
        var output = concat(inputs, this.axis);
        return [output];
    };
    return CpuConcat;
}(concat_1.Concat));
exports.CpuConcat = CpuConcat;
function concat(x, axis) {
    var input0 = x[0];
    var inputShape = input0.dims;
    if (axis >= inputShape.length || axis < (-1 * inputShape.length)) {
        throw new Error("axis specified for concat doesn't match input dimensionality");
    }
    if (axis < 0) {
        axis = inputShape.length + axis;
    }
    // ensure all of the non-concatenated axes match each other
    // along the way, calculate the shape of the output tensor
    var concatAxisSize = inputShape[axis];
    var outputShape = new Array(inputShape.length);
    for (var i = 1; i < x.length; i++) {
        var dataN = x[i];
        var dataNShape = dataN.dims;
        for (var axisIndex = 0; axisIndex < inputShape.length; axisIndex++) {
            // add to the placeholder for computing output shape
            if (axisIndex === axis) {
                concatAxisSize += dataNShape[axisIndex];
            }
            // ensure all non-cancatenated axes match each other
            else if (inputShape[axisIndex] !== dataNShape[axisIndex]) {
                throw new Error("non concat dimensions must match");
            }
            // fill the 'outputShape' array
            outputShape[axisIndex] = dataNShape[axisIndex];
        }
    }
    // complete the 'outputShape' array
    outputShape[axis] = concatAxisSize;
    // main logic
    var output = new tensor_1.Tensor(outputShape, input0.type);
    var Y = output.numberData;
    // the axisPitch is the number of elements to add to move
    // to the next split axis in the output
    var axisPitch = 1;
    for (var i = outputShape.length - 1; i >= axis; i--) {
        axisPitch *= outputShape[i];
    }
    var outputBase = 0;
    for (var inputIndex = 0; inputIndex < x.length; inputIndex++) {
        var dataN = x[inputIndex];
        // the inputAxisPitch is the number of elements to add
        // to move to the next split axis in the input
        var inputAxisPitch = 1;
        for (var i = dataN.dims.length - 1; i >= axis; i--) {
            inputAxisPitch *= dataN.dims[i];
        }
        var inputData = dataN.numberData;
        var inputSize = Util.ShapeUtil.size(dataN.dims);
        // copy the data across.
        // for every 'inputAxisPitch' values copied, we move over by
        // the 'axisPitch'
        var outputOffset = outputBase;
        for (var i = 0, j = 0; i < inputSize; i++) {
            Y[outputOffset + i] = inputData[i];
            if (++j === inputAxisPitch) {
                // subtract inputAxisPitch because output is being indexed by 'i'
                outputOffset += (axisPitch - inputAxisPitch);
                j = 0;
            }
        }
        outputBase += inputAxisPitch;
    }
    return output;
}
exports.concat = concat;
//# sourceMappingURL=concat.js.map