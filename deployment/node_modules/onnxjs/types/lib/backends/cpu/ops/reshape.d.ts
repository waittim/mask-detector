import { Reshape } from '../../../ops/reshape';
import { Tensor } from '../../../tensor';
import { CpuInferenceHandler } from '../inference-handler';
export declare class CpuReshape extends Reshape {
    run(inferenceHandler: CpuInferenceHandler, inputs: Tensor[]): Tensor[];
}
export declare function reshape(x: Tensor, shape: Tensor): Tensor;
