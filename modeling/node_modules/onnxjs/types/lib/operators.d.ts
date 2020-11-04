import { Attribute } from './attribute';
import { InferenceHandler } from './backend';
import { Tensor } from './tensor';
export interface Operator {
    initialize(attributes: Attribute): void;
    checkInputs(inputs: Tensor[]): boolean;
    run(inferenceHandler: InferenceHandler, inputs: Tensor[]): Tensor[] | Promise<Tensor[]>;
}
export declare const NUMBER_TYPES: ReadonlyArray<Tensor.DataType>;
export declare const INT_TYPES: ReadonlyArray<Tensor.DataType>;
export declare const FLOAT_TYPES: ReadonlyArray<Tensor.DataType>;
