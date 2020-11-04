import { AveragePool, GlobalAveragePool, GlobalMaxPool, MaxPool } from '../../../ops/pool';
import { Tensor } from '../../../tensor';
import { CpuInferenceHandler } from '../inference-handler';
export declare class CpuAveragePool extends AveragePool {
    run(inferenceHandler: CpuInferenceHandler, inputs: Tensor[]): Tensor[];
}
export declare class CpuGlobalAveragePool extends GlobalAveragePool {
    run(inferenceHandler: CpuInferenceHandler, inputs: Tensor[]): Tensor[] | Promise<Tensor[]>;
}
export declare class CpuMaxPool extends MaxPool {
    run(inferenceHandler: CpuInferenceHandler, inputs: Tensor[]): Tensor[] | Promise<Tensor[]>;
}
export declare class CpuGlobalMaxPool extends GlobalMaxPool {
    run(inferenceHandler: CpuInferenceHandler, inputs: Tensor[]): Tensor[] | Promise<Tensor[]>;
}
export declare function averagePool(input: Tensor, autoPad: string, countIncludePad: boolean, kernelShape: number[], pads: number[], strides: number[]): Tensor;
export declare function globalAveragePool(input: Tensor): Tensor;
export declare function maxPool(input: Tensor, autoPad: string, kernelShape: number[], pads: number[], strides: number[]): Tensor;
export declare function globalMaxPool(input: Tensor): Tensor;
/**
 * Perform pooling operations based on input
 * @param isGlobalOperator If true, perform global pooling.
 * @param input The input tensor.
 * @param autoPad DEPRECATED attribute supported for legacy models. Specifies how to implicitly calculate pads in each
 *     dimension. Can take values NOTSET, SAME_UPPER, SAME_LOWER, or VALID
 * @param countIncludePad Whether include pad pixels when calculating values for the edges.
 * @param kernelShape The size of the kernel along each axis.
 * @param pads Padding for the beginning and ending along each axis. `pads` format should be as follow [x1_begin,
 *       x2_begin...x1_end, x2_end,...], where xi_begin the number of pixels added at the beginning of axis `i` and
 *       xi_end, the number of pixels added at the end of axis `i`.
 * @param strides Stride along each axis.
 * @param startVal The initial value to do pooling operations
 * @param processOp The operation to be performed on each element inside kernel
 * @param finalOp The operation to be performed over all elements inside kernel
 */
export declare function pool(isGlobalOperator: boolean, input: Tensor, autoPad: string, countIncludePad: boolean, kernelShape: number[], pads: number[], strides: number[], startVal: number, processOp: (a: number, b: number) => number, finalOp: (a: number, b: number) => number): Tensor;
