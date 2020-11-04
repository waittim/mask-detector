import { Transpose } from '../../../ops/transpose';
import { Tensor } from '../../../tensor';
import { CpuInferenceHandler } from '../inference-handler';
export declare class CpuTranspose extends Transpose {
    run(inferenceHandler: CpuInferenceHandler, inputs: Tensor[]): Tensor[];
}
export declare function transpose(x: Tensor, perm: number[]): Tensor;
