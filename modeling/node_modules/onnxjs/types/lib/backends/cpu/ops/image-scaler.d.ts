import { ImageScaler } from '../../../ops/image-scaler';
import { Tensor } from '../../../tensor';
import { CpuInferenceHandler } from '../inference-handler';
export declare class CpuImageScaler extends ImageScaler {
    run(inferenceHandler: CpuInferenceHandler, inputs: Tensor[]): Tensor[];
}
export declare function imageScaler(x: Tensor, bias: number[], scale: number): Tensor;
