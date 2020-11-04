import { Gather } from '../../../ops/gather';
import { Tensor } from '../../../tensor';
import { CpuInferenceHandler } from '../inference-handler';
export declare class CpuGather extends Gather {
    run(inferenceHandler: CpuInferenceHandler, inputs: Tensor[]): Tensor[] | Promise<Tensor[]>;
}
export declare function gather(x: Tensor, indices: Tensor, axis: number): Tensor;
