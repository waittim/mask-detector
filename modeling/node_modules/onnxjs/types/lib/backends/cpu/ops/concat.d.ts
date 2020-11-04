import { Concat } from '../../../ops/concat';
import { Tensor } from '../../../tensor';
import { CpuInferenceHandler } from '../inference-handler';
export declare class CpuConcat extends Concat {
    run(inferenceHandler: CpuInferenceHandler, inputs: Tensor[]): Tensor[];
}
export declare function concat(x: Tensor[], axis: number): Tensor;
