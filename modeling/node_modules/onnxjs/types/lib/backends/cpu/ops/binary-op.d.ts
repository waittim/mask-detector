import { Attribute } from '../../../attribute';
import { BinaryOp } from '../../../ops/binary-op';
import { Tensor } from '../../../tensor';
import { CpuInferenceHandler } from '../inference-handler';
export declare class CpuBinaryOp extends BinaryOp {
    private opLambda?;
    constructor(typeConstraint: ReadonlyArray<Tensor.DataType>, opLambda?: ((e1: number, e2: number) => number) | undefined, opType?: string, resultType?: Tensor.DataType);
    initialize(attributes: Attribute): void;
    run(inferenceHandler: CpuInferenceHandler, inputs: Tensor[]): Tensor[];
}
