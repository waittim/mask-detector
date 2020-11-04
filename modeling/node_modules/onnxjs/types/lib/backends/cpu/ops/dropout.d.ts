import { Dropout } from '../../../ops/dropout';
import { Tensor } from '../../../tensor';
import { CpuInferenceHandler } from '../inference-handler';
export declare class CpuDropout extends Dropout {
    run(inferenceHandler: CpuInferenceHandler, inputs: Tensor[]): Tensor[];
}
export declare function dropout(x: Tensor, ratio: number, isTestMode: boolean): Tensor;
