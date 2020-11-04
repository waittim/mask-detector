import { Sum } from '../../../ops/sum';
import { Tensor } from '../../../tensor';
import { CpuInferenceHandler } from '../inference-handler';
export declare class CpuSum extends Sum {
    run(inferenceHandler: CpuInferenceHandler, inputs: Tensor[]): Tensor[];
}
export declare function sum(x: Tensor[]): Tensor;
