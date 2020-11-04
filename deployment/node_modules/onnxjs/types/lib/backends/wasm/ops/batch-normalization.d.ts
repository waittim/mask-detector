import { BatchNormalization } from '../../../ops/batch-normalization';
import { Tensor } from '../../../tensor';
import { WasmInferenceHandler } from '../inference-handler';
export declare class WasmBatchNormalization extends BatchNormalization {
    run(inferenceHandler: WasmInferenceHandler, inputs: Tensor[]): Tensor[];
    checkInputTypes(inputs: Tensor[]): boolean;
}
