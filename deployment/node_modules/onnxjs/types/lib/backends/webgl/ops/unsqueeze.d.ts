import { Unsqueeze } from '../../../ops/unsqueeze';
import { Tensor } from '../../../tensor';
import { WebGLInferenceHandler } from '../inference-handler';
export declare class WebGLUnsqueeze extends Unsqueeze {
    run(inferenceHandler: WebGLInferenceHandler, inputs: Tensor[]): Tensor[];
}
