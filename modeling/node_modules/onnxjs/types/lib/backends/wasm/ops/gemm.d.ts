import { Gemm } from '../../../ops/gemm';
import { Tensor } from '../../../tensor';
import { WasmInferenceHandler } from '../inference-handler';
export declare class WasmGemm extends Gemm {
    run(inferenceHandler: WasmInferenceHandler, inputs: Tensor[]): Tensor[];
    checkInputTypes(inputs: Tensor[]): boolean;
}
