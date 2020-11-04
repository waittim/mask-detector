import { Softmax } from '../../../ops/softmax';
import { Tensor } from '../../../tensor';
import { CpuInferenceHandler } from '../inference-handler';
export declare class CpuSoftmax extends Softmax {
    run(inferenceHandler: CpuInferenceHandler, inputs: Tensor[]): Tensor[];
}
export declare function softmax(x: Tensor, axis: number): Tensor;
