import Long from 'long';
import { onnx } from 'onnx-proto';
import { Graph } from './graph';
import { Tensor } from './tensor';
export declare function checkInputsShape(inputs: Tensor[], ...expectedDimensions: number[]): boolean;
export declare class MatMulUtil {
    /**
     * Fix the input shapes for MatMul operation if they need fixing
     * @param dimsA The shape of tensor A. Should be an array of positive integers
     * @param dimsB The shape of tensor B. Should be an array of positive integers
     * @returns A tuple containing the preprocessed input shapes as required by ONNX specifications
     */
    static preprocessInputShapes(dimsA: ReadonlyArray<number>, dimsB: ReadonlyArray<number>): [ReadonlyArray<number>, ReadonlyArray<number>];
    /**
     * Fix the output shape computed for MatMul operation if it needs fixing
     * @param outputShape The computed outputShape. Should be an array (atleast of length 2) of positive integers.
     * This will be mutated.
     * @param aRank The rank of tensor A.
     * @param bRank The rank of tensor B.
     */
    static postprocessOutputShape(outputShape: number[], aRank: number, bRank: number): void;
    /**
     * Calculate the expected shape when matrix multiplication
     * @param a The shape of tensor A. Should be a tuple of 2 positive integers
     * @param b The shape of tensor B. Should be a tuple of 2 positive integers
     * @returns The expected shape of the result, or undefined if N/A
     */
    static calcMatMulShape(a: [number, number], b: [number, number]): [number, number] | undefined;
}
export declare class BroadcastUtil {
    /**
     * Calculate the expected shape when broadcasting 2 tensors
     * @param a The shape of tensor A. Should be an array of positive integers
     * @param b The shape of tensor B. Should be an array of positive integers
     * @param isMatMul Whether the operation is MatMul
     * @returns The expected shape of the result, or undefined if N/A
     */
    static calcShape(adims: ReadonlyArray<number>, bdims: ReadonlyArray<number>, isMatMul?: boolean): ReadonlyArray<number> | undefined;
    /**
     * Given the indices of a broadcasted tensor, calculate the original indices
     * @param broadcastedIndices The given indices of the broadcasted tensor.
     * @param originalShape The original shape of the tensor before broadcas
     * @returns The calculated indices that maps to the original tensor.
     */
    static index(broadcastedIndices: ReadonlyArray<number>, originalShape: ReadonlyArray<number>): number[];
    /**
     * Given the indices of a broadcasted tensor, calculate the original indices
     * @param broadcastedIndices The given indices of the broadcasted tensor.
     * @param originalShape The original shape of the tensor before broadcast
     * @param originalIndices The mapping of broadcastedIndices to the originalIndices (output parameter - will be
     *     mutated).
     */
    static fillIndex(broadcastedIndices: ReadonlyArray<number>, originalShape: ReadonlyArray<number>, originalIndices: number[]): void;
    /**
     * Perform the broadcasting operation on the specific operator
     * @param a The input tensor A
     * @param b The input tensor B
     * @param op The operator lambda function
     * @param inplace Whether to write the result back to A.
     * @returns The result tensor, or undefined if input not broadcastable.
     */
    static calc(a: Tensor, b: Tensor, op: (a: string | number, b: string | number) => (string | number), inplace: boolean, resultType?: Tensor.DataType): Tensor | undefined;
    /**
     * Determine if a shape is unidirectional broadcastable to another shape
     * @param shape The input shape
     * @param finalShape The desired shape after broadcasting
     */
    static isValidBroadcast(shape: ReadonlyArray<number>, finalShape: ReadonlyArray<number>): boolean;
}
export declare function arrayCopyHelper(target: number[] | Tensor.NumberType, source: number[] | Tensor.NumberType, targetIndex: number, sourceIndex: number, blockSize: number): void;
export declare class GemmUtil {
    static getShapeOfGemmResult(leftShape: ReadonlyArray<number>, transLeft: boolean, rightShape: ReadonlyArray<number>, transRight: boolean, biasShape?: ReadonlyArray<number>): ReadonlyArray<number>;
}
export declare class ProtoUtil {
    static tensorDataTypeFromProto(typeProto: onnx.TensorProto.DataType): Tensor.DataType;
    static tensorDimsFromProto(dims: Array<number | Long>): number[];
    static tensorValueTypeFromProto(valueType: onnx.TypeProto.ITensor): Graph.ValueType;
}
export declare class LongUtil {
    static longToNumber(n: Long | number): number;
}
export declare class ShapeUtil {
    static size(dims: ReadonlyArray<number>): number;
    static sizeFromDimension(dims: ReadonlyArray<number>, axis: number): number;
    static sizeToDimension(dims: ReadonlyArray<number>, axis: number): number;
    static getSizeFromDimensionRange(dims: ReadonlyArray<number>, start: number, end: number): number;
    static computeStrides(dims: ReadonlyArray<number>): ReadonlyArray<number>;
    static transpose(dims: ReadonlyArray<number>): ReadonlyArray<number>;
    static indicesToOffset(indices: ReadonlyArray<number>, strides: ReadonlyArray<number>, axis?: number): number;
    static offsetToIndices(offset: number, strides: ReadonlyArray<number>): ReadonlyArray<number>;
    /**
     * normailze axis of range [-r, r) into [0, r).
     */
    static normalizeAxis(axis: number, tensorRank: number): number;
    static normalizeAxes(axes: ReadonlyArray<number>, tensorRank: number): number[];
    /**
     * Increment an index into a tensor (in lexicographic ordering), wrapping around the specified upper_bound.
     * @param index Given index to increment (Will be mutated)
     * @param dims The dimensions of the tensor for which the given index corresponds to
     * @param axisToIncrementOn The 1-indexed axis to increment on. If undefined, axisToIncrementOn == rank
     */
    static incrementIndex(index: number[], dims: ReadonlyArray<number>, axisToIncrementOn?: number): void;
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
    static calculateReshapedDims(originalDims: ReadonlyArray<number>, shapeHints: number[] | ReadonlyArray<number> | Tensor.IntegerType): ReadonlyArray<number>;
    /**
     * Sorts a given array based on the indices in the Perm array
     * Used in Transpose
     * @param a Array to be sorted such as dims or strides
     * @param perm Perm given; if null a will be reversed
     */
    static sortBasedOnPerm(a: ReadonlyArray<number>, perm?: ReadonlyArray<number>): ReadonlyArray<number>;
    /**
     * Pads a given shape according to the padding values
     * @param dims shape of the Tensor to be padded
     * @param pad pad values
     */
    static padShape(dims: ReadonlyArray<number>, pad: ReadonlyArray<number>): ReadonlyArray<number>;
    /**
     * Determines if the two shapes are identical
     * @param shape1
     * @param shape2
     */
    static areEqual(shape1: ReadonlyArray<number>, shape2: ReadonlyArray<number>): boolean;
    /**
     * Validates if the given `dims` or `shape` is valid in ONNX.js context and returns data size
     * @param dims - input `dims` that needs to be checked
     */
    static validateDimsAndCalcSize(dims: ReadonlyArray<number>): number;
    /**
     * Determines the shape of output tensor y = flatten(x, axis)
     * @param dims - shape of input tensor
     * @param axis - flatten axis, in the range [-r, r]
     */
    static flattenShape(dims: ReadonlyArray<number>, axis: number): ReadonlyArray<number>;
    /**
     * Determines the shape of output tensor y = squeeze(x, axes)
     * @param dims - shape of input tensor
     * @param axes - squeeze axes
     */
    static squeezeShape(dims: ReadonlyArray<number>, axes: ReadonlyArray<number>): ReadonlyArray<number>;
    /**
     * Determines the shape of output tensor y = unsqueeze(x, axes)
     * @param dims - shape of input tensor
     * @param axes - unsqueeze axes
     */
    static unsqueezeShape(dims: ReadonlyArray<number>, axes: ReadonlyArray<number>): ReadonlyArray<number>;
}
export declare class MathUtil {
    static sqr(target: number[] | Tensor.NumberType, source: number[] | Tensor.NumberType, targetIndex: number, sourceIndex: number, blockSize: number): void;
    static axpy(target: number[] | Tensor.NumberType, source: number[] | Tensor.NumberType, targetIndex: number, sourceIndex: number, blockSize: number, alpha: number): void;
    static powx(target: number[] | Tensor.NumberType, source: number[] | Tensor.NumberType, targetIndex: number, sourceIndex: number, blockSize: number, b: number): void;
    static mul(target: number[] | Tensor.NumberType, source: number[] | Tensor.NumberType, targetIndex: number, sourceIndex: number, blockSize: number): void;
}
export declare class SplitUtil {
    /**
     * Calculates new Shapes from existing one and the splits given along the axis provides
     * @param dims Shape of the Tensor to be splitted into two or more Shapes
     * @param axis The dimension along which the Tensor will be split
     * @param splits Offsets for the start of each split
     */
    static splitShape(dims: ReadonlyArray<number>, axis: number, split: number[], numOutputs?: number): [number[][], number[]];
    static determineSplit(numElementsAlongAxis: number, numOutputs: number, split: number[]): void;
}
export declare class ReduceUtil {
    /**
     * Perform reduce operations on the specific operator
     * @param a Input tensor data
     * @param axes The dimensions along which the Tensor will be reduced
     * @param keepdims If set to true, the axes which are reduced are left in the
     *    result as dimensions with size one.
     * @param op1 The operation to be performed on each element in the tensor
     * @param op2 The operation to be performed between elements in the tensor
     */
    static calcReduce(a: Tensor, axes: number[], keepdims: boolean, op1: (b: number) => number, op2: (a: number, b: number) => number): Tensor;
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
    static calcReduceByAxis(input: Tensor.NumberType, axes: number[], dims: number[], curAxisInd: number, pos: number, op1: (b: number) => number, op2: (a: number, b: number) => number): number;
    /**
     * Calculate the expected shape of a reduce operation
     * @param dims The input tensor dimension
     * @param axes The dimensions along which the Tensor will be reduced
     * @param keepdims If set to true, the axes which are reduced are left in the
     *    result as dimensions with size one.
     */
    static calcReduceShape(dims: ReadonlyArray<number>, axes: ReadonlyArray<number>, keepDims: boolean): number[];
}
export declare class PoolConvUtil {
    /**
     * Adjust the kernel, strides, pads to correct rank. Set to default value if not present
     * @param isGlobalOperator If true, perform global pooling.
     * @param inputDims The input tensor dimension.
     * @param kernelShape The size of the kernel along each axis.
     * @param strides Stride along each axis.
     * @param pads Padding for the beginning and ending along each axis.
     */
    static adjustPoolAttributes(isGlobalOperator: boolean, inputDims: ReadonlyArray<number>, kernelShape: number[], strides: number[], pads: number[]): void;
    static adjustPadsBasedOnAutoPad(inputDims: ReadonlyArray<number>, strides: number[], dilations: number[], kernelShape: number[], pads: number[], autoPad?: string): void;
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
    static computePoolOutputShape(isGlobalOperator: boolean, inputDims: ReadonlyArray<number>, strides: number[], kernelShape: number[], pads: number[], autoPad?: string): number[];
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
    static computeConvOutputShape(inputDims: ReadonlyArray<number>, filterDims: ReadonlyArray<number>, strides: number[], dilations: number[], kernelShape: number[], pads: number[], autoPad?: string): number[];
    private static computeShapeHelper;
    private static adjustPadAndReturnShape;
}
