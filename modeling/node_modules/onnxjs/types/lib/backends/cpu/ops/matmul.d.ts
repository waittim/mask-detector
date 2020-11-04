import { MatMul } from '../../../ops/matmul';
import { Tensor } from '../../../tensor';
import { CpuInferenceHandler } from '../inference-handler';
export declare class CpuMatMul extends MatMul {
    run(inferenceHandler: CpuInferenceHandler, inputs: Tensor[]): Tensor[];
}
export declare function matMul(a: Tensor, b: Tensor): Tensor;
/**
 * perform matrix multiply on C = alpha * A * B + beta * C
 * @param A data of tensor A, whose shape is [M,K] or [K,M] (if transA)
 * @param B data of tensor B, whose shape is [K,N] or [N,K] (if transB)
 * @param C data of tensor C, whose shape is [M,N]
 */
export declare function matMul2d(A: Float32Array | Float64Array, B: Float32Array | Float64Array, C: Float32Array | Float64Array, transA: boolean, transB: boolean, alpha: number, beta: number, M: number, N: number, K: number): void;
