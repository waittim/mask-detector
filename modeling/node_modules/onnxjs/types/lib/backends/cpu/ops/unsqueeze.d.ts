import { Unsqueeze } from '../../../ops/unsqueeze';
import { Tensor } from '../../../tensor';
import { CpuInferenceHandler } from '../inference-handler';
export declare class CpuUnsqueeze extends Unsqueeze {
    run(inferenceHandler: CpuInferenceHandler, inputs: Tensor[]): Tensor[];
}
export declare function unsqueeze(x: Tensor, axes: number[]): Tensor;
