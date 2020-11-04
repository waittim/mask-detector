import { Conv } from '../../../ops/conv';
import { Tensor } from '../../../tensor';
import { WasmInferenceHandler } from '../inference-handler';
export declare class WasmConv extends Conv {
    run(inferenceHandler: WasmInferenceHandler, inputs: Tensor[]): Promise<Tensor[]>;
    checkInputTypes(inputs: Tensor[]): boolean;
}
