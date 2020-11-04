import { Squeeze } from '../../../ops/squeeze';
import { Tensor } from '../../../tensor';
import { WebGLInferenceHandler } from '../inference-handler';
export declare class WebGLSqueeze extends Squeeze {
    run(inferenceHandler: WebGLInferenceHandler, inputs: Tensor[]): Tensor[];
}
