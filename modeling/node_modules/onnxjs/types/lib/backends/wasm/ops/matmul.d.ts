import { MatMul } from '../../../ops/matmul';
import { Tensor } from '../../../tensor';
import { WasmInferenceHandler } from '../inference-handler';
export declare class WasmMatMul extends MatMul {
    run(inferenceHandler: WasmInferenceHandler, inputs: Tensor[]): Tensor[];
    checkInputTypes(inputs: Tensor[]): boolean;
}
