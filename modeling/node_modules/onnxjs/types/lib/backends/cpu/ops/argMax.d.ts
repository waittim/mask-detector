import { ArgMax } from '../../../ops/argMax';
import { Tensor } from '../../../tensor';
import { CpuInferenceHandler } from '../inference-handler';
export declare class CpuArgMax extends ArgMax {
    run(inferenceHandler: CpuInferenceHandler, inputs: Tensor[]): Tensor[] | Promise<Tensor[]>;
}
export declare function argMax(x: Tensor, axis: number, keepdims: boolean): Tensor;
