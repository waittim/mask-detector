import { BatchNormalization } from '../../../ops/batch-normalization';
import { Tensor } from '../../../tensor';
import { CpuInferenceHandler } from '../inference-handler';
export declare class CpuBatchNormalization extends BatchNormalization {
    run(inferenceHandler: CpuInferenceHandler, inputs: Tensor[]): Tensor[];
}
export declare function batchNormalization(x: Tensor, scale: Tensor, b: Tensor, mean: Tensor, variance: Tensor, epsilon: number, momentum: number, spatial: number): Tensor;
