import { Slice, SliceV10 } from '../../../ops/slice';
import { Tensor } from '../../../tensor';
import { CpuInferenceHandler } from '../inference-handler';
export declare class CpuSlice extends Slice {
    run(inferenceHandler: CpuInferenceHandler, inputs: Tensor[]): Tensor[];
}
export declare class CpuSliceV10 extends SliceV10 {
    run(inferenceHandler: CpuInferenceHandler, inputs: Tensor[]): Tensor[];
}
export declare function slice(x: Tensor, starts: ReadonlyArray<number>, ends: ReadonlyArray<number>, axes: ReadonlyArray<number>): Tensor;
