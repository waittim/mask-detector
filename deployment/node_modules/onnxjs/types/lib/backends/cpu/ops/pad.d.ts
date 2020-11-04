import { Pad } from '../../../ops/pad';
import { Tensor } from '../../../tensor';
import { CpuInferenceHandler } from '../inference-handler';
export declare class CpuPad extends Pad {
    run(inferenceHandler: CpuInferenceHandler, inputs: Tensor[]): Tensor[];
}
export declare function pad(x: Tensor, mode: string, value: number, pads: number[]): Tensor;
