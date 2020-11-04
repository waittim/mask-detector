import { Attribute } from '../attribute';
import { InferenceHandler } from '../backend';
import { Operator } from '../operators';
import { Tensor } from '../tensor';
export declare abstract class BinaryOp implements Operator {
    protected typeConstraint: ReadonlyArray<Tensor.DataType>;
    protected opType?: string | undefined;
    protected resultType?: "string" | "bool" | "float32" | "int32" | "float64" | "int8" | "uint8" | "int16" | "uint16" | "uint32" | undefined;
    constructor(typeConstraint: ReadonlyArray<Tensor.DataType>, opType?: string | undefined, resultType?: "string" | "bool" | "float32" | "int32" | "float64" | "int8" | "uint8" | "int16" | "uint16" | "uint32" | undefined);
    abstract run(inferenceHandler: InferenceHandler, inputs: Tensor[]): Tensor[] | Promise<Tensor[]>;
    initialize(attributes: Attribute): void;
    checkInputs(inputs: Tensor[]): boolean;
    protected checkInputTypes(inputs: Tensor[]): boolean;
}
