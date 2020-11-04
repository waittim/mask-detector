import { Squeeze } from '../../../ops/squeeze';
import { Tensor } from '../../../tensor';
import { CpuInferenceHandler } from '../inference-handler';
export declare class CpuSqueeze extends Squeeze {
    run(inferenceHandler: CpuInferenceHandler, inputs: Tensor[]): Tensor[];
}
export declare function squeeze(x: Tensor, axes: number[]): Tensor;
