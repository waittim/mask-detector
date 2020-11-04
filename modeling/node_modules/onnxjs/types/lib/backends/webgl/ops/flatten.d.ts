import { Flatten } from '../../../ops/flatten';
import { Tensor } from '../../../tensor';
import { WebGLInferenceHandler } from '../inference-handler';
export declare class WebGLFlatten extends Flatten {
    run(inferenceHandler: WebGLInferenceHandler, inputs: Tensor[]): Tensor[];
}
