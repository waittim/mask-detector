import { InstanceNormalization } from '../../../ops/instance-normalization';
import { Tensor } from '../../../tensor';
import { CpuInferenceHandler } from '../inference-handler';
export declare class CpuInstanceNormalization extends InstanceNormalization {
    run(inferenceHandler: CpuInferenceHandler, inputs: Tensor[]): Tensor[];
}
export declare function instanceNormalization(x: Tensor, scale: Tensor, b: Tensor, epsilon: number): Tensor;
