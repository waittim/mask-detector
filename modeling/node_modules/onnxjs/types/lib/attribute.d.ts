import { onnx } from 'onnx-proto';
import { Tensor } from './tensor';
export declare namespace Attribute {
    interface DataTypeMap {
        float: number;
        int: number;
        string: string;
        tensor: Tensor;
        floats: number[];
        ints: number[];
        strings: string[];
        tensors: Tensor[];
    }
    type DataType = keyof DataTypeMap;
}
declare type ValueTypes = Attribute.DataTypeMap[Attribute.DataType];
declare type Value = [ValueTypes, Attribute.DataType];
export declare class Attribute {
    constructor(attributes: onnx.IAttributeProto[] | null | undefined);
    set(key: string, type: Attribute.DataType, value: ValueTypes): void;
    delete(key: string): void;
    getFloat(key: string, defaultValue?: Attribute.DataTypeMap['float']): number;
    getInt(key: string, defaultValue?: Attribute.DataTypeMap['int']): number;
    getString(key: string, defaultValue?: Attribute.DataTypeMap['string']): string;
    getTensor(key: string, defaultValue?: Attribute.DataTypeMap['tensor']): Tensor;
    getFloats(key: string, defaultValue?: Attribute.DataTypeMap['floats']): number[];
    getInts(key: string, defaultValue?: Attribute.DataTypeMap['ints']): number[];
    getStrings(key: string, defaultValue?: Attribute.DataTypeMap['strings']): string[];
    getTensors(key: string, defaultValue?: Attribute.DataTypeMap['tensors']): Tensor[];
    private get;
    private static getType;
    private static getValue;
    private static getValueNoCheck;
    protected _attributes: Map<string, Value>;
}
export {};
