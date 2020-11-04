import { Upsample } from '../../../ops/upsample';
import { Tensor } from '../../../tensor';
import { CpuInferenceHandler } from '../inference-handler';
export declare class CpuUpsample extends Upsample {
    run(inferenceHandler: CpuInferenceHandler, inputs: Tensor[]): Tensor[];
}
