import { AveragePool, GlobalAveragePool, GlobalMaxPool, MaxPool } from '../../../ops/pool';
import { Tensor } from '../../../tensor';
import { WasmInferenceHandler } from '../inference-handler';
export declare class WasmAveragePool extends AveragePool {
    checkInputTypes(inputs: Tensor[]): boolean;
    run(inferenceHandler: WasmInferenceHandler, inputs: Tensor[]): Promise<Tensor[]>;
}
export declare class WasmGlobalAveragePool extends GlobalAveragePool {
    checkInputTypes(inputs: Tensor[]): boolean;
    run(inferenceHandler: WasmInferenceHandler, inputs: Tensor[]): Promise<Tensor[]>;
}
export declare class WasmMaxPool extends MaxPool {
    checkInputTypes(inputs: Tensor[]): boolean;
    run(inferenceHandler: WasmInferenceHandler, inputs: Tensor[]): Promise<Tensor[]>;
}
export declare class WasmGlobalMaxPool extends GlobalMaxPool {
    checkInputTypes(inputs: Tensor[]): boolean;
    run(inferenceHandler: WasmInferenceHandler, inputs: Tensor[]): Promise<Tensor[]>;
}
