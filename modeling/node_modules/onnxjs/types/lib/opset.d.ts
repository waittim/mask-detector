import { Graph } from './graph';
import { Operator } from './operators';
export interface OpSet {
    domain: string;
    version: number;
}
export declare namespace OpSet {
    interface OperatorConstructor {
        (node: Graph.Node): Operator;
    }
    /**
     * Domain of an opset, it can be an empty string(default value, represent for ai.onnx), or 'ai.onnx.ml'
     */
    type Domain = '' | 'ai.onnx.ml';
    /**
     * A resolve rule consists of 4 items: opType, opSetDomain, versionSelector and operatorConstructor
     */
    type ResolveRule = [string, Domain, string, OperatorConstructor];
}
export declare function resolveOperator(node: Graph.Node, opsets: ReadonlyArray<OpSet>, rules: ReadonlyArray<OpSet.ResolveRule>): Operator;
