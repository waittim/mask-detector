import { Gemm } from '../../../ops/gemm';
import { Tensor } from '../../../tensor';
import { CpuInferenceHandler } from '../inference-handler';
export declare class CpuGemm extends Gemm {
    run(inferenceHandler: CpuInferenceHandler, inputs: Tensor[]): Tensor[];
}
export declare function gemm(a: Tensor, b: Tensor, alpha: number, beta: number, transA: boolean, transB: boolean, c?: Tensor): Tensor;
