import { Reshape } from '../../../ops/reshape';
import { Tensor } from '../../../tensor';
import { WebGLInferenceHandler } from '../inference-handler';
export declare class WebGLReshape extends Reshape {
    run(inferenceHandler: WebGLInferenceHandler, inputs: Tensor[]): Tensor[];
}
export declare function reshape(inferenceHandler: WebGLInferenceHandler, input: Tensor, reshapedDims: ReadonlyArray<number>): Tensor;
