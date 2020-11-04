import { Softmax } from '../../../ops/softmax';
import { Tensor } from '../../../tensor';
import { WasmInferenceHandler } from '../inference-handler';
export declare class WasmSoftmax extends Softmax {
    run(inferenceHandler: WasmInferenceHandler, inputs: Tensor[]): Tensor[];
    checkInputTypes(inputs: Tensor[]): boolean;
}
