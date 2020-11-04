import { Attribute } from '../attribute';
import { InferenceHandler } from '../backend';
import { Operator } from '../operators';
import { Tensor } from '../tensor';
export declare abstract class Dropout implements Operator {
    abstract run(inferenceHandler: InferenceHandler, inputs: Tensor[]): Tensor[] | Promise<Tensor[]>;
    initialize(attributes: Attribute): void;
    checkInputs(inputs: Tensor[]): boolean;
    protected checkInputTypes(inputs: Tensor[]): boolean;
    protected ratio: number;
    protected testMode: boolean;
}
