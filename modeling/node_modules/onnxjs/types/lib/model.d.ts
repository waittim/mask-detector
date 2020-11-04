/// <reference types="node" />
import { Graph } from './graph';
import { OpSet } from './opset';
export declare class Model {
    constructor();
    load(buf: Buffer, graphInitializer?: Graph.Initializer): void;
    private _graph;
    get graph(): Graph;
    private _opsets;
    get opsets(): ReadonlyArray<OpSet>;
}
