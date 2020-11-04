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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoolConvUtil = exports.ReduceUtil = exports.SplitUtil = exports.MathUtil = exports.ShapeUtil = exports.LongUtil = exports.ProtoUtil = exports.GemmUtil = exports.arrayCopyHelper = exports.BroadcastUtil = exports.MatMulUtil = exports.checkInputsShape = void 0;
var long_1 = __importDefault(require("long"));
var onnx_proto_1 = require("onnx-proto");
var tensor_1 = require("./tensor");
// check the inputs shape before running an OP.
// return true when the inputs pass the check
// return false when the inputs do not fit the requirement
// throw exception when fatal error or not implemented
function checkInputsShape(inputs) {
    var expectedDimensions = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        expectedDimensions[_i - 1] = arguments[_i];
    }
    if (!inputs || inputs.length !== expectedDimensions.length) {
        return false;
    }
    for (var i = 0; i < inputs.length; i++) {
        if (!inputs[i].dims || inputs[i].dims.length !== expectedDimensions[i]) {
            return false;
        }
    }
    return true;
}
exports.checkInputsShape = checkInputsShape;
var MatMulUtil = /** @class */ (function () {
    function MatMulUtil() {
    }
    /**
     * Fix the input shapes for MatMul operation if they need fixing
     * @param dimsA The shape of tensor A. Should be an array of positive integers
     * @param dimsB The shape of tensor B. Should be an array of positive integers
     * @returns A tuple containing the preprocessed input shapes as required by ONNX specifications
     */
    MatMulUtil.preprocessInputShapes = function (dimsA, dimsB) {
        // If the first argument is 1-D, it is promoted to a matrix by prepending
        // a 1 to its dimensions. After matrix multiplication the prepended 1 is
        // removed.
        var a = (dimsA.length === 1) ? [1, dimsA[0]] : dimsA;
        // If the second argument is 1-D, it is promoted to a matrix by appending
        // a 1 to its dimensions. After matrix multiplication the appended 1 is
        // removed.
        var b = (dimsB.length === 1) ? [dimsB[0], 1] : dimsB;
        return [a, b];
    };
    /**
     * Fix the output shape computed for MatMul operation if it needs fixing
     * @param outputShape The computed outputShape. Should be an array (atleast of length 2) of positive integers.
     * This will be mutated.
     * @param aRank The rank of tensor A.
     * @param bRank The rank of tensor B.
     */
    MatMulUtil.postprocessOutputShape = function (outputShape, aRank, bRank) {
        // Remove prepended dimension if first input is 1d
        if (aRank === 1) {
            // outputShape = outputShape.slice(0, outputShape.length - 2).concat(outputShape.slice(outputShape.length - 1));
            outputShape.splice(outputShape.length - 2, 1);
        }
        // Remove appended dimension if second input is 1d
        if (bRank === 1) {
            outputShape.pop();
        }
    };
    /**
     * Calculate the expected shape when matrix multiplication
     * @param a The shape of tensor A. Should be a tuple of 2 positive integers
     * @param b The shape of tensor B. Should be a tuple of 2 positive integers
     * @returns The expected shape of the result, or undefined if N/A
     */
    MatMulUtil.calcMatMulShape = function (a, b) {
        return (a[1] !== b[0]) ? undefined : [a[0], b[1]];
    };
    return MatMulUtil;
}());
exports.MatMulUtil = MatMulUtil;
var BroadcastUtil = /** @class */ (function () {
    function BroadcastUtil() {
    }
    /**
     * Calculate the expected shape when broadcasting 2 tensors
     * @param a The shape of tensor A. Should be an array of positive integers
     * @param b The shape of tensor B. Should be an array of positive integers
     * @param isMatMul Whether the operation is MatMul
     * @returns The expected shape of the result, or undefined if N/A
     */
    BroadcastUtil.calcShape = function (adims, bdims, isMatMul) {
        var _a;
        if (isMatMul === void 0) { isMatMul = false; }
        var arank = adims.length;
        var brank = bdims.length;
        if (arank === 0) {
            return bdims;
        }
        if (brank === 0) {
            return adims;
        }
        var crank = Math.max(adims.length, bdims.length);
        var cdims = new Array(crank);
        // calculate the last 2 dimension if it is MatMul
        if (isMatMul) {
            if (arank < 2 || brank < 2) {
                return undefined;
            }
            var cShapeMatMul = MatMulUtil.calcMatMulShape([adims[arank - 2], adims[arank - 1]], [bdims[brank - 2], bdims[brank - 1]]);
            if (cShapeMatMul === undefined) {
                return undefined;
            }
            _a = __read(cShapeMatMul, 2), cdims[crank - 2] = _a[0], cdims[crank - 1] = _a[1];
        }
        for (var i = isMatMul ? 3 : 1; i <= crank; i++) {
            var aLen = arank - i < 0 ? 1 : adims[arank - i];
            var bLen = brank - i < 0 ? 1 : bdims[brank - i];
            if (aLen !== bLen && aLen > 1 && bLen > 1) {
                return undefined;
            }
            cdims[crank - i] = Math.max(aLen, bLen);
        }
        return cdims;
    };
    /**
     * Given the indices of a broadcasted tensor, calculate the original indices
     * @param broadcastedIndices The given indices of the broadcasted tensor.
     * @param originalShape The original shape of the tensor before broadcas
     * @returns The calculated indices that maps to the original tensor.
     */
    BroadcastUtil.index = function (broadcastedIndices, originalShape) {
        // NOTE 1: we assume the parameter broadcastedIndices is valid. ie. it should have the same
        // length as the broadcasted shape, and for each dimension the index should
        // not be out of range.
        var originalIndices = new Array(originalShape.length);
        BroadcastUtil.fillIndex(broadcastedIndices, originalShape, originalIndices);
        return originalIndices;
    };
    /**
     * Given the indices of a broadcasted tensor, calculate the original indices
     * @param broadcastedIndices The given indices of the broadcasted tensor.
     * @param originalShape The original shape of the tensor before broadcast
     * @param originalIndices The mapping of broadcastedIndices to the originalIndices (output parameter - will be
     *     mutated).
     */
    BroadcastUtil.fillIndex = function (broadcastedIndices, originalShape, originalIndices) {
        // NOTE 1: we assume the parameter broadcastedIndices is valid. ie. it should have the same length as the
        // broadcasted shape, and for each dimension the index should not be out of range.
        // NOTE 2: we assume the parameter originalIndices has the same length as the originalShape
        var dimOffset = broadcastedIndices.length - originalShape.length;
        for (var i = 0; i < originalShape.length; i++) {
            originalIndices[i] = broadcastedIndices[dimOffset + i] % originalShape[i];
        }
    };
    /**
     * Perform the broadcasting operation on the specific operator
     * @param a The input tensor A
     * @param b The input tensor B
     * @param op The operator lambda function
     * @param inplace Whether to write the result back to A.
     * @returns The result tensor, or undefined if input not broadcastable.
     */
    BroadcastUtil.calc = function (a, b, op, inplace, resultType) {
        var outputShape = BroadcastUtil.calcShape(a.dims, b.dims);
        if (outputShape) {
            if (inplace && !ShapeUtil.areEqual(outputShape, a.dims)) {
                // B is not broadcastable to A, failed to calculate inplace.
                return undefined;
            }
            var size = ShapeUtil.size(outputShape);
            var c = inplace ? a : new tensor_1.Tensor(outputShape, resultType || a.type);
            // both inputs are scalars
            if (outputShape.length === 0) {
                c.set([], op(a.get([]), b.get([])));
            }
            // atleast one input is a non-scalar
            else {
                var outputIndices = new Array(outputShape.length);
                var originalIndicesA = new Array(a.dims.length);
                var originalIndicesB = new Array(b.dims.length);
                var valA = 0;
                var valB = 0;
                var isAScalar = false;
                var isBScalar = false;
                if (a.dims.length === 0) {
                    valA = a.get([]);
                    isAScalar = true;
                }
                if (b.dims.length === 0) {
                    valB = b.get([]);
                    isBScalar = true;
                }
                var rest = void 0;
                for (var i = 0; i < size; i++) {
                    // traversal indices
                    rest = i;
                    for (var j = outputShape.length - 1; j >= 0; j--) {
                        outputIndices[j] = rest % outputShape[j];
                        rest = Math.floor(rest / outputShape[j]);
                    }
                    if (!isAScalar) {
                        // map outputIndices (which is actually broadcasted) to the originalIndices
                        BroadcastUtil.fillIndex(outputIndices, a.dims, originalIndicesA);
                        valA = a.get(originalIndicesA);
                    }
                    if (!isBScalar) {
                        BroadcastUtil.fillIndex(outputIndices, b.dims, originalIndicesB);
                        valB = b.get(originalIndicesB);
                    }
                    c.set(outputIndices, op(valA, valB));
                }
            }
            return c;
        }
        return undefined;
    };
    /**
     * Determine if a shape is unidirectional broadcastable to another shape
     * @param shape The input shape
     * @param finalShape The desired shape after broadcasting
     */
    BroadcastUtil.isValidBroadcast = function (shape, finalShape) {
        // align shape to the right
        var inputRank = shape.length;
        var finalRank = finalShape.length;
        if (inputRank > finalRank) {
            return false;
        }
        for (var i = 1; i <= inputRank; i++) {
            if (shape[inputRank - i] !== 1 && shape[inputRank - i] !== finalShape[finalRank - i]) {
                return false;
            }
        }
        return true;
    };
    return BroadcastUtil;
}());
exports.BroadcastUtil = BroadcastUtil;
// copy array helper
// mimics memcpy as much as possible
function arrayCopyHelper(target, source, targetIndex, sourceIndex, blockSize) {
    if (sourceIndex < 0 || sourceIndex >= source.length) {
        throw new Error("sourceIndex out of bounds");
    }
    if (targetIndex < 0 || targetIndex >= target.length) {
        throw new Error("targetIndex out of bounds");
    }
    if (sourceIndex + blockSize > source.length) {
        throw new Error("source indices to be copied are outside bounds");
    }
    if (targetIndex + blockSize > target.length) {
        throw new Error("target array is too small to hold result");
    }
    for (var offset = 0; offset < blockSize; offset++) {
        target[targetIndex + offset] = source[sourceIndex + offset];
    }
}
exports.arrayCopyHelper = arrayCopyHelper;
var GemmUtil = /** @class */ (function () {
    function GemmUtil() {
    }
    // will make sure input shapes are compatible for this op
    // and return back the shape of the output in the form of a tuple
    // will throw exception if the input shapes are not compatible
    GemmUtil.getShapeOfGemmResult = function (leftShape, transLeft, rightShape, transRight, biasShape) {
        if (leftShape.length !== 2 || rightShape.length !== 2) {
            throw new Error("shape need to be of size 2");
        }
        var M;
        var K;
        var N;
        if (transLeft) {
            M = leftShape[1];
            K = leftShape[0];
        }
        else {
            M = leftShape[0];
            K = leftShape[1];
        }
        var kDim = -1;
        if (transRight) {
            N = rightShape[0];
            kDim = 1;
        }
        else {
            N = rightShape[1];
            kDim = 0;
        }
        if (rightShape[kDim] !== K) {
            throw new Error("dimension mismatch");
        }
        if (M <= 0 || N <= 0 || K <= 0) {
            throw new Error("invalid shape specified");
        }
        if (biasShape && !BroadcastUtil.isValidBroadcast(biasShape, [M, N])) {
            throw new Error("gemm: invalid bias shape for broadcast");
        }
        return [M, N, K];
    };
    return GemmUtil;
}());
exports.GemmUtil = GemmUtil;
var ProtoUtil = /** @class */ (function () {
    function ProtoUtil() {
    }
    ProtoUtil.tensorDataTypeFromProto = function (typeProto) {
        switch (typeProto) {
            case onnx_proto_1.onnx.TensorProto.DataType.INT8:
                return 'int8';
            case onnx_proto_1.onnx.TensorProto.DataType.UINT8:
                return 'uint8';
            case onnx_proto_1.onnx.TensorProto.DataType.BOOL:
                return 'bool';
            case onnx_proto_1.onnx.TensorProto.DataType.INT16:
                return 'int16';
            case onnx_proto_1.onnx.TensorProto.DataType.UINT16:
                return 'uint16';
            case onnx_proto_1.onnx.TensorProto.DataType.INT32:
                return 'int32';
            case onnx_proto_1.onnx.TensorProto.DataType.UINT32:
                return 'uint32';
            case onnx_proto_1.onnx.TensorProto.DataType.FLOAT:
                return 'float32';
            case onnx_proto_1.onnx.TensorProto.DataType.DOUBLE:
                return 'float64';
            case onnx_proto_1.onnx.TensorProto.DataType.STRING:
                return 'string';
            // For INT64/UINT64, reduce their value to 32-bits.
            // Should throw exception when overflow
            case onnx_proto_1.onnx.TensorProto.DataType.INT64:
                return 'int32';
            case onnx_proto_1.onnx.TensorProto.DataType.UINT64:
                return 'uint32';
            default:
                throw new Error("unsupported data type: " + onnx_proto_1.onnx.TensorProto.DataType[typeProto]);
        }
    };
    ProtoUtil.tensorDimsFromProto = function (dims) {
        // get rid of Long type for dims
        return dims.map(function (d) { return long_1.default.isLong(d) ? d.toNumber() : d; });
    };
    ProtoUtil.tensorValueTypeFromProto = function (valueType) {
        return {
            tensorType: ProtoUtil.tensorDataTypeFromProto(valueType.elemType),
            shape: { dims: ProtoUtil.tensorDimsFromProto(valueType.shape.dim.map(function (d) { return d.dimValue; })) }
        };
    };
    return ProtoUtil;
}());
exports.ProtoUtil = ProtoUtil;
var LongUtil = /** @class */ (function () {
    function LongUtil() {
    }
    LongUtil.longToNumber = function (n) {
        return long_1.default.isLong(n) ? n.toNumber() : n;
    };
    return LongUtil;
}());
exports.LongUtil = LongUtil;
var ShapeUtil = /** @class */ (function () {
    function ShapeUtil() {
    }
    ShapeUtil.size = function (dims) {
        return ShapeUtil.getSizeFromDimensionRange(dims, 0, dims.length);
    };
    // `axis` inclusive
    ShapeUtil.sizeFromDimension = function (dims, axis) {
        if (axis < 0 || axis > dims.length) {
            throw new Error("invalid dimension of " + axis + " for sizeFromDimension as Tensor has " + dims.length + " dimensions.");
        }
        return ShapeUtil.getSizeFromDimensionRange(dims, axis, dims.length);
    };
    // `axis` exclusive
    ShapeUtil.sizeToDimension = function (dims, axis) {
        if (axis < 0 || axis > dims.length) {
            throw new Error("invalid dimension of " + axis + " for sizeToDimension as Tensor has " + dims.length + " dimensions.");
        }
        return ShapeUtil.getSizeFromDimensionRange(dims, 0, axis);
    };
    ShapeUtil.getSizeFromDimensionRange = function (dims, start, end) {
        var size = 1;
        for (var i = start; i < end; i++) {
            // safety check as this method is called by multiple other methods requiring size.
            // size cannot be 0 or negative.
            if (dims[i] <= 0) {
                throw new Error(
                // tslint:disable-next-line:max-line-length
                "cannot get valid size from specified dimension range. Most likely the range contains 0 or negative values in them.");
            }
            size *= dims[i];
        }
        return size;
    };
    ShapeUtil.computeStrides = function (dims) {
        var rank = dims.length;
        if (rank === 0) {
            return [];
        }
        else if (rank === 1) {
            return [1];
        }
        var strides = new Array(rank);
        strides[rank - 1] = 1;
        strides[rank - 2] = dims[rank - 1];
        for (var i = rank - 3; i >= 0; --i) {
            strides[i] = strides[i + 1] * dims[i + 1];
        }
        return strides;
    };
    ShapeUtil.transpose = function (dims) {
        var copy = dims.slice();
        return copy.reverse();
    };
    ShapeUtil.indicesToOffset = function (indices, strides, axis) {
        if (axis === undefined) {
            axis = indices.length;
        }
        var offset = 0;
        for (var i = 0; i < axis; ++i) {
            offset += strides[i] * indices[i];
        }
        return offset;
    };
    ShapeUtil.offsetToIndices = function (offset, strides) {
        var rank = strides.length;
        if (rank === 0) {
            return [];
        }
        else if (rank === 1) {
            return [offset * strides[0]];
        }
        var indices = new Array(strides.length);
        for (var i = 0; i < indices.length - 1; ++i) {
            indices[i] = Math.floor(offset / strides[i]);
            offset -= indices[i] * strides[i];
        }
        indices[indices.length - 1] = offset;
        return indices;
    };
    /**
     * normailze axis of range [-r, r) into [0, r).
     */
    ShapeUtil.normalizeAxis = function (axis, tensorRank) {
        if (axis < -tensorRank && axis >= tensorRank) {
            throw new Error('unsupported axis for this operation.');
        }
        return axis < 0 ? axis + tensorRank : axis;
    };
    ShapeUtil.normalizeAxes = function (axes, tensorRank) {
        var _this = this;
        return axes.map(function (x) { return _this.normalizeAxis(x, tensorRank); });
    };
    // Increment an index into a tensor (in lexicographic
    // ordering), wrapping around the specified upper_bound.
    /**
     * Increment an index into a tensor (in lexicographic ordering), wrapping around the specified upper_bound.
     * @param index Given index to increment (Will be mutated)
     * @param dims The dimensions of the tensor for which the given index corresponds to
     * @param axisToIncrementOn The 1-indexed axis to increment on. If undefined, axisToIncrementOn == rank
     */
    ShapeUtil.incrementIndex = function (index, dims, axisToIncrementOn) {
        if (dims.length === 0 || index.length === 0) {
            throw new Error("Index incrementing unsupported for scalar Tensor");
        }
        if (axisToIncrementOn === undefined) {
            axisToIncrementOn = dims.length;
        }
        else {
            if (axisToIncrementOn <= 0 || axisToIncrementOn > dims.length) {
                throw new Error("Incorrect axis to increment on");
            }
        }
        for (var k = axisToIncrementOn - 1; k >= 0; --k) {
            index[k]++;
            if (index[k] < dims[k]) {
                break;
            }
            index[k] = 0;
        }
    };
    /**
     * Produces a new dimensions array based on the values in the 'originalDimensions' and 'shape' array
     * Used in Reshape
     * @param originalDims Original Shape array
     * @param shapeHints array containing values to compute the new dimensions
     * For example:
     * originalDims = [2,2] and shapeHints = [0,-1] will return [2,2]
     * originalDims = [2,2] and shapeHints = [4] will return [4]
     * originalDims = [2,2] and shapeHints = [5] will throw an exception
     * https://github.com/onnx/onnx/blob/master/docs/Operators.md#Reshape
     */
    ShapeUtil.calculateReshapedDims = function (originalDims, shapeHints) {
        // reshape to a Scalar Tensor
        if (shapeHints.length === 0) {
            if (originalDims.length === 0 || ShapeUtil.size(originalDims) === 1) {
                return [];
            }
            else {
                throw new Error("cannot reshape to a scalar Tensor");
            }
        }
        var nDims = shapeHints.length;
        var reshapedDims = new Array(nDims);
        var unknownDimension = -1;
        var newTensorSize = 1;
        for (var i = 0; i < nDims; i++) {
            if (shapeHints[i] < -1) {
                throw new Error('a dimension in shape hints cannot be less than -1');
            }
            if (shapeHints[i] === -1) {
                if (unknownDimension !== -1) {
                    throw new Error('at most one dimension in shape hints can be -1');
                }
                unknownDimension = i;
            }
            else {
                if (shapeHints[i] === 0) {
                    if (i >= originalDims.length) {
                        throw new Error('the dimension with value zero exceeds the dimension size of the input tensor');
                    }
                    reshapedDims[i] = originalDims[i];
                }
                else {
                    reshapedDims[i] = shapeHints[i];
                }
                newTensorSize *= reshapedDims[i];
            }
        }
        var oldTensorSize = ShapeUtil.size(originalDims);
        if (unknownDimension !== -1) {
            if (oldTensorSize % newTensorSize !== 0) {
                throw new Error("the input tensor cannot be reshaped to the requested shape. Input shape: [" + originalDims + "] Output shape: [" + shapeHints + "]");
            }
            reshapedDims[unknownDimension] = oldTensorSize / newTensorSize;
        }
        // validate sizes from originalDims and reshapedDims match
        else {
            if (newTensorSize !== oldTensorSize) {
                throw new Error("reshapedDims and originalDims don't have matching sizes");
            }
        }
        return reshapedDims;
    };
    /**
     * Sorts a given array based on the indices in the Perm array
     * Used in Transpose
     * @param a Array to be sorted such as dims or strides
     * @param perm Perm given; if null a will be reversed
     */
    ShapeUtil.sortBasedOnPerm = function (a, perm) {
        if (perm) {
            return perm.map(function (v) { return a[v]; });
        }
        else {
            return a.slice().reverse();
        }
    };
    /**
     * Pads a given shape according to the padding values
     * @param dims shape of the Tensor to be padded
     * @param pad pad values
     */
    ShapeUtil.padShape = function (dims, pad) {
        var rank = dims.length;
        return dims.map(function (v, i) { return v + pad[i] + pad[i + rank]; });
    };
    /**
     * Determines if the two shapes are identical
     * @param shape1
     * @param shape2
     */
    ShapeUtil.areEqual = function (shape1, shape2) {
        if (shape1.length !== shape2.length) {
            return false;
        }
        return shape1.every(function (v, i) { return v === shape2[i]; });
    };
    /**
     * Validates if the given `dims` or `shape` is valid in ONNX.js context and returns data size
     * @param dims - input `dims` that needs to be checked
     */
    ShapeUtil.validateDimsAndCalcSize = function (dims) {
        var e_1, _a;
        if (dims.length > 6) {
            throw new TypeError("Only rank 0 to 6 is supported for tensor shape.");
        }
        var size = 1;
        try {
            for (var dims_1 = __values(dims), dims_1_1 = dims_1.next(); !dims_1_1.done; dims_1_1 = dims_1.next()) {
                var n = dims_1_1.value;
                if (!Number.isInteger(n)) {
                    throw new TypeError("Invalid shape: " + n + " is not an integer");
                }
                if (n < 0 || n > 2147483647) {
                    throw new TypeError("Invalid shape: length " + n + " is not allowed");
                }
                size *= n;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (dims_1_1 && !dims_1_1.done && (_a = dims_1.return)) _a.call(dims_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return size;
    };
    /**
     * Determines the shape of output tensor y = flatten(x, axis)
     * @param dims - shape of input tensor
     * @param axis - flatten axis, in the range [-r, r]
     */
    ShapeUtil.flattenShape = function (dims, axis) {
        if (axis < 0) {
            axis += dims.length;
        }
        var total = dims.reduce(function (x, y) { return x * y; }, 1);
        var right = dims.slice(axis).reduce(function (x, y) { return x * y; }, 1);
        var outputDims = [total / right, right];
        return outputDims;
    };
    /**
     * Determines the shape of output tensor y = squeeze(x, axes)
     * @param dims - shape of input tensor
     * @param axes - squeeze axes
     */
    ShapeUtil.squeezeShape = function (dims, axes) {
        var outputDims = new Array();
        // sanity check
        axes = ShapeUtil.normalizeAxes(axes, dims.length);
        for (var i = 0; i < dims.length; i++) {
            var inSqueezeList = axes.indexOf(i) >= 0;
            if (inSqueezeList && dims[i] !== 1) {
                throw new Error("squeeze an axis of size different than 1");
            }
            if ((axes.length === 0 && dims[i] > 1) || (axes.length > 0 && !inSqueezeList)) {
                outputDims.push(dims[i]);
            }
        }
        return outputDims;
    };
    /**
     * Determines the shape of output tensor y = unsqueeze(x, axes)
     * @param dims - shape of input tensor
     * @param axes - unsqueeze axes
     */
    ShapeUtil.unsqueezeShape = function (dims, axes) {
        var outputDims = new Array(dims.length + axes.length);
        // initialize the array elements to 0
        outputDims.fill(0);
        // set all axes indices to 1 in outputDims and check for duplicates
        for (var i = 0; i < axes.length; i++) {
            var axis = ShapeUtil.normalizeAxis(axes[i], dims.length);
            if (axis >= outputDims.length) {
                throw new Error("'axes' has an out of range axis");
            }
            if (outputDims[axis] !== 0) {
                throw new Error("'axes' has a duplicate axis");
            }
            outputDims[axis] = 1;
        }
        // fill in the zero entries of outputDims with the input tensor's shape
        var inputDimsIterator = 0;
        for (var i = 0; i < outputDims.length; i++) {
            if (outputDims[i] === 0) {
                outputDims[i] = dims[inputDimsIterator++];
            }
        }
        // sanity check assertion. 'inputDimsIterator'
        // should be equal to the length of 'dims'
        if (inputDimsIterator !== dims.length) {
            throw new Error('the unsqueezed dimension could not be established');
        }
        return outputDims;
    };
    return ShapeUtil;
}());
exports.ShapeUtil = ShapeUtil;
// bunch of helper methods that do a variety of math operations
var MathUtil = /** @class */ (function () {
    function MathUtil() {
    }
    // y = (x*x) + y
    MathUtil.sqr = function (target, source, targetIndex, sourceIndex, blockSize) {
        if (sourceIndex < 0 || sourceIndex >= source.length) {
            throw new Error("sourceIndex out of bounds");
        }
        if (targetIndex < 0 || targetIndex >= target.length) {
            throw new Error("targetIndex out of bounds");
        }
        if (sourceIndex + blockSize > source.length) {
            throw new Error("source indices to be copied are outside bounds");
        }
        if (targetIndex + blockSize > target.length) {
            throw new Error("target array is too small to hold result");
        }
        for (var offset = 0; offset < blockSize; offset++) {
            target[targetIndex + offset] += Math.pow(source[sourceIndex + offset], 2);
        }
    };
    // y = ax + y
    MathUtil.axpy = function (target, source, targetIndex, sourceIndex, blockSize, alpha) {
        if (sourceIndex < 0 || sourceIndex >= source.length) {
            throw new Error("sourceIndex out of bounds");
        }
        if (targetIndex < 0 || targetIndex >= target.length) {
            throw new Error("targetIndex out of bounds");
        }
        if (sourceIndex + blockSize > source.length) {
            throw new Error("source indices to be copied are outside bounds");
        }
        if (targetIndex + blockSize > target.length) {
            throw new Error("target array is too small to hold result");
        }
        for (var offset = 0; offset < blockSize; offset++) {
            target[targetIndex + offset] += (alpha * source[sourceIndex + offset]);
        }
    };
    // y = pow(x, b)
    MathUtil.powx = function (target, source, targetIndex, sourceIndex, blockSize, b) {
        if (sourceIndex < 0 || sourceIndex >= source.length) {
            throw new Error("sourceIndex out of bounds");
        }
        if (targetIndex < 0 || targetIndex >= target.length) {
            throw new Error("targetIndex out of bounds");
        }
        if (sourceIndex + blockSize > source.length) {
            throw new Error("source indices to be copied are outside bounds");
        }
        if (targetIndex + blockSize > target.length) {
            throw new Error("target array is too small to hold result");
        }
        for (var offset = 0; offset < blockSize; offset++) {
            target[targetIndex + offset] = Math.pow(source[sourceIndex + offset], b);
        }
    };
    // y = x * y
    MathUtil.mul = function (target, source, targetIndex, sourceIndex, blockSize) {
        if (sourceIndex < 0 || sourceIndex >= source.length) {
            throw new Error("sourceIndex out of bounds");
        }
        if (targetIndex < 0 || targetIndex >= target.length) {
            throw new Error("targetIndex out of bounds");
        }
        if (sourceIndex + blockSize > source.length) {
            throw new Error("source indices to be copied are outside bounds");
        }
        if (targetIndex + blockSize > target.length) {
            throw new Error("target array is too small to hold result");
        }
        for (var offset = 0; offset < blockSize; offset++) {
            target[targetIndex + offset] = (source[sourceIndex + offset] * target[targetIndex + offset]);
        }
    };
    return MathUtil;
}());
exports.MathUtil = MathUtil;
var SplitUtil = /** @class */ (function () {
    function SplitUtil() {
    }
    /**
     * Calculates new Shapes from existing one and the splits given along the axis provides
     * @param dims Shape of the Tensor to be splitted into two or more Shapes
     * @param axis The dimension along which the Tensor will be split
     * @param splits Offsets for the start of each split
     */
    SplitUtil.splitShape = function (dims, axis, split, numOutputs) {
        if (split.length === 0) {
            if (!numOutputs) {
                throw new Error("need to know number of outputs when the 'split' attribute is not specified");
            }
            SplitUtil.determineSplit(dims[axis], numOutputs, split);
        }
        var shapes = [];
        var offsets = [0];
        for (var i = 0; i < split.length; ++i) {
            if (i !== 0) {
                offsets.push(offsets[i - 1] + split[i - 1]);
            }
            var shape = dims.slice();
            shape[axis] = split[i];
            shapes.push(shape);
        }
        return [shapes, offsets];
    };
    SplitUtil.determineSplit = function (numElementsAlongAxis, numOutputs, split) {
        // If 'split' is not specified by the user, we need to partition the number of elements equally among the outputs
        if (numElementsAlongAxis % numOutputs !== 0) {
            throw new Error("cannot split tensor to equal sized parts");
        }
        for (var i = 0; i < numOutputs; ++i) {
            split.push(numElementsAlongAxis / numOutputs);
        }
    };
    return SplitUtil;
}());
exports.SplitUtil = SplitUtil;
var ReduceUtil = /** @class */ (function () {
    function ReduceUtil() {
    }
    /**
     * Perform reduce operations on the specific operator
     * @param a Input tensor data
     * @param axes The dimensions along which the Tensor will be reduced
     * @param keepdims If set to true, the axes which are reduced are left in the
     *    result as dimensions with size one.
     * @param op1 The operation to be performed on each element in the tensor
     * @param op2 The operation to be performed between elements in the tensor
     */
    ReduceUtil.calcReduce = function (a, axes, keepdims, op1, op2) {
        var dims = a.dims.slice(0);
        // if axes is not set, perform reduce on all axes
        if (axes.length === 0) {
            dims.forEach(function (d, ind) { return axes.push(ind); });
        }
        // get a temporary broadcastable output shape
        var outputDims = ReduceUtil.calcReduceShape(dims, axes, true);
        // loop through the output and calculate result one by one
        var size = ShapeUtil.size(outputDims);
        var y = new tensor_1.Tensor(outputDims, a.type);
        var strides = ShapeUtil.computeStrides(outputDims);
        var inputStrides = ShapeUtil.computeStrides(dims);
        var indicesY = new Array(dims.length);
        for (var i = 0; i < size; i++) {
            var indices = ShapeUtil.offsetToIndices(i, strides);
            // map index
            BroadcastUtil.fillIndex(indices, dims, indicesY);
            y.set(indices, ReduceUtil.calcReduceByAxis(a.numberData, axes, dims, 0, ShapeUtil.indicesToOffset(indicesY, inputStrides), op1, op2));
        }
        if (keepdims) {
            return y;
        }
        else {
            // keepdims == 0, calculate the expected shape
            return new tensor_1.Tensor(ReduceUtil.calcReduceShape(dims, axes, keepdims), y.type, undefined, undefined, y.data, y.dataId);
        }
    };
    /**
     * Perform reduce operations on the specific operator on specific axes
     * @param a Input tensor data
     * @param axes The dimensions along which the Tensor will be reduced
     * @param dims The input dimension.
     * @param curAxisInd Index in axes specifying the current dimension along
     *      which the tensor will be reduced
     * @param pos The current index of element to perform operation
     * @param op1 The operation to be performed on each element in the tensor
     * @param op2 The operation to be performed between elements in the tensor
     */
    ReduceUtil.calcReduceByAxis = function (input, axes, dims, curAxisInd, pos, op1, op2) {
        var res = 0;
        if (curAxisInd >= axes.length) {
            return op1(input[pos]);
        }
        var axis = axes[curAxisInd];
        var step = axis >= dims.length ? 1 : ShapeUtil.size(dims.slice(axis + 1));
        for (var i = 0; i < dims[axis]; i++) {
            res = i === 0 ? ReduceUtil.calcReduceByAxis(input, axes, dims, curAxisInd + 1, pos, op1, op2) :
                op2(res, ReduceUtil.calcReduceByAxis(input, axes, dims, curAxisInd + 1, pos, op1, op2));
            pos += step;
        }
        return res;
    };
    /**
     * Calculate the expected shape of a reduce operation
     * @param dims The input tensor dimension
     * @param axes The dimensions along which the Tensor will be reduced
     * @param keepdims If set to true, the axes which are reduced are left in the
     *    result as dimensions with size one.
     */
    ReduceUtil.calcReduceShape = function (dims, axes, keepDims) {
        var outputDims = dims.slice();
        for (var i = 0; i < axes.length; i++) {
            if (keepDims) {
                outputDims[axes[i]] = 1;
            }
            else {
                outputDims[axes[i]] = 0;
            }
        }
        return outputDims.filter(function (dim) { return dim !== 0; });
    };
    return ReduceUtil;
}());
exports.ReduceUtil = ReduceUtil;
var PoolConvUtil = /** @class */ (function () {
    function PoolConvUtil() {
    }
    /**
     * Adjust the kernel, strides, pads to correct rank. Set to default value if not present
     * @param isGlobalOperator If true, perform global pooling.
     * @param inputDims The input tensor dimension.
     * @param kernelShape The size of the kernel along each axis.
     * @param strides Stride along each axis.
     * @param pads Padding for the beginning and ending along each axis.
     */
    PoolConvUtil.adjustPoolAttributes = function (isGlobalOperator, inputDims, kernelShape, strides, pads) {
        if (!isGlobalOperator && kernelShape.length !== inputDims.length - 2) {
            throw new Error("length of specified kernel shapes should be 2 less than length of input dimensions");
        }
        if (isGlobalOperator) {
            // adjust kernel shape to cover the input dims
            for (var dim = 0; dim < inputDims.length - 2; dim++) {
                if (dim >= kernelShape.length) {
                    kernelShape.push(inputDims[dim + 2]);
                }
                else {
                    kernelShape[dim] = inputDims[dim + 2];
                }
            }
        }
        // adjust strides length to match kernel shape length
        for (var dim = 0; dim < kernelShape.length; dim++) {
            if (dim < strides.length) {
                if (strides[dim] < 0) {
                    throw new Error("strides should be greater than or equal to 1");
                }
            }
            else {
                strides.push(1);
            }
        }
        // adjust pads length to match 2 * kernel shape length
        for (var dim = 0; dim < kernelShape.length * 2; dim++) {
            if (dim < pads.length) {
                if (pads[dim] < 0) {
                    throw new Error("pad should be greater than or equal to 1");
                }
            }
            else {
                pads.push(0);
            }
        }
        // sanity checks for values in kernel shapes and pads
        for (var dim = 0; dim < kernelShape.length; dim++) {
            if (kernelShape[dim] <= 0) {
                throw new Error("kernel shapes need to be greater than 0");
            }
            if (pads[dim] >= kernelShape[dim] || pads[dim + kernelShape.length] >= kernelShape[dim]) {
                throw new Error("pads should be smaller than kernel");
            }
        }
    };
    // adjust pad values based on 'autoPad' attribute
    PoolConvUtil.adjustPadsBasedOnAutoPad = function (inputDims, strides, dilations, kernelShape, pads, autoPad) {
        if (!autoPad) {
            return;
        }
        if (pads.length !== 2 * (inputDims.length - 2)) {
            throw new Error('length of pads should be twice the length of data dimensions');
        }
        if (strides.length !== (inputDims.length - 2)) {
            throw new Error('length of strides should be the length of data dimensions');
        }
        if (kernelShape.length !== (inputDims.length - 2)) {
            throw new Error('length of kernel shapes should be the length of data dimensions');
        }
        for (var dim = 0; dim < inputDims.length - 2; dim++) {
            PoolConvUtil.adjustPadAndReturnShape(inputDims[dim + 2], strides[dim], dilations[dim], kernelShape[dim], pads, dim, dim + inputDims.length - 2, autoPad);
        }
    };
    /**
     * Calculate the output shape for Pool ops based on input attributes. (Should be used only for Pool ops)
     * @param isGlobalOperator If true, perform global pooling.
     * @param inputDims The input tensor dimension. (inputs[0].dims)
     * @param strides Stride along each axis.
     * @param kernelShape The size of the kernel along each axis.
     * @param pads Padding for the beginning and ending along each axis.
     * @param autoPad DEPRECATED attribute supported for legacy models. Specifies how to implicitly calculate pads in each
     *     dimension. Can take values NOTSET, SAME_UPPER, SAME_LOWER, or VALID.
     */
    PoolConvUtil.computePoolOutputShape = function (isGlobalOperator, inputDims, strides, kernelShape, pads, autoPad) {
        if (inputDims.length <= 0) {
            throw new Error("input shape must be of size greater than 0");
        }
        // Add batch size and number of channels of output
        var outputDims = [inputDims[0], inputDims[1]];
        // TODO: support dilations for pool operators
        var dilations = new Array(kernelShape.length).fill(1);
        PoolConvUtil.computeShapeHelper(isGlobalOperator, inputDims, outputDims, strides, dilations, kernelShape, pads, autoPad);
        return outputDims;
    };
    /**
     * Calculate the output shape for Conv op based on input attributes. (Should be used only for Conv op)
     * @param inputDims The input tensor dimension. (inputs[0].dims)
     * @param filterDims The filter tensor dimension. (inputs[1].dims)
     * @param strides Stride along each axis.
     * @param kernelShape The size of the kernel along each axis.
     * @param pads Padding for the beginning and ending along each axis.
     * @param autoPad DEPRECATED attribute supported for legacy models. Specifies how to implicitly calculate pads in each
     *     dimension. Can take values NOTSET, SAME_UPPER, SAME_LOWER, or VALID.
     */
    PoolConvUtil.computeConvOutputShape = function (inputDims, filterDims, strides, dilations, kernelShape, pads, autoPad) {
        if (inputDims.length <= 0 || filterDims.length <= 0) {
            throw new Error("invalid input tensor dims or invalid filter tensor dims");
        }
        // Add batch size and number of channels of output
        var outputDims = [inputDims[0], filterDims[0]];
        PoolConvUtil.computeShapeHelper(false, inputDims, outputDims, strides, dilations, kernelShape, pads, autoPad);
        return outputDims;
    };
    // will compute output shapes for data dimensions ONLY (i.e.) no batch size and channels
    // called by computePoolOutputShape() and computeConvOutputShape()
    // adjust pads based on 'autoPad' attribute prior to shape computation
    PoolConvUtil.computeShapeHelper = function (isGlobalOperator, inputDims, outputDims, strides, dilations, kernelShape, pads, autoPad) {
        if (isGlobalOperator) {
            for (var dim = 0; dim < inputDims.length - 2; dim++) {
                outputDims.push(1);
            }
        }
        else {
            for (var dim = 0; dim < inputDims.length - 2; dim++) {
                outputDims.push(PoolConvUtil.adjustPadAndReturnShape(inputDims[dim + 2], strides[dim], dilations[dim], kernelShape[dim], pads, dim, dim + inputDims.length - 2, autoPad));
            }
        }
    };
    // helper for computeShapeHelper() and adjustPadsBasedOnAutoPad()
    // adjusts pad value for given 'autoPad' string and computes output shape along a particular dimension
    PoolConvUtil.adjustPadAndReturnShape = function (inSize, stride, dilation, kernel, pads, padHeadIndex, padTailIndex, autoPad) {
        var dkernel = dilation * (kernel - 1) + 1;
        if (autoPad && autoPad !== 'NOTSET') {
            switch (autoPad) {
                case 'VALID':
                    pads[padHeadIndex] = 0;
                    pads[padTailIndex] = 0;
                    return Math.floor(((inSize - dkernel) / stride) + 1);
                case 'SAME_LOWER':
                case 'SAME_UPPER':
                    if (dilation !== 1) {
                        throw new Error("Dilation not supported for SAME_UPPER or SAME_LOWER");
                    }
                    var legacyTargetSize = (inSize + stride - 1) / stride;
                    var padNeeded = (legacyTargetSize - 1) * stride + kernel - inSize;
                    pads[padHeadIndex] = (autoPad === 'SAME_LOWER') ? Math.floor((padNeeded + 1) / 2) : Math.floor(padNeeded / 2);
                    pads[padTailIndex] = padNeeded - pads[padHeadIndex];
                    return Math.floor(((inSize + padNeeded - kernel) / stride) + 1);
                default:
                    throw new Error("Unsupported AutoPad type");
            }
        }
        else {
            return Math.floor(((inSize + pads[padHeadIndex] + pads[padTailIndex] - dkernel) / stride) + 1);
        }
    };
    return PoolConvUtil;
}());
exports.PoolConvUtil = PoolConvUtil;
//# sourceMappingURL=util.js.map