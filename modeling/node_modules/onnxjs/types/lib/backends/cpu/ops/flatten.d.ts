import { Flatten } from '../../../ops/flatten';
import { Tensor } from '../../../tensor';
import { CpuInferenceHandler } from '../inference-handler';
export declare class CpuFlatten extends Flatten {
    run(inferenceHandler: CpuInferenceHandler, inputs: Tensor[]): Tensor[];
}
export declare function flatten(x: Tensor, axis: number): Tensor;
