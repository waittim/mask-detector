import { BinaryOp } from '../../../ops/binary-op';
import { Tensor } from '../../../tensor';
import { WasmInferenceHandler } from '../inference-handler';
export declare class WasmBinaryOp extends BinaryOp {
    constructor(typeConstraint: ReadonlyArray<Tensor.DataType>, opType: string, resultType?: Tensor.DataType);
    run(inferenceHandler: WasmInferenceHandler, inputs: Tensor[]): Tensor[];
}
