import { Lrn } from '../../../ops/lrn';
import { Tensor } from '../../../tensor';
import { CpuInferenceHandler } from '../inference-handler';
export declare class CpuLrn extends Lrn {
    run(inferenceHandler: CpuInferenceHandler, inputs: Tensor[]): Tensor[];
}
export declare function lrn(x: Tensor, alpha: number, beta: number, bias: number, size: number): Tensor;
