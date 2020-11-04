import { onnx } from 'onnx-proto';
import { Attribute } from './attribute';
import { Tensor } from './tensor';
export declare namespace Graph {
    interface Shape {
        readonly dims: ReadonlyArray<number>;
    }
    interface ValueType {
        readonly tensorType: Tensor.DataType;
        readonly shape: Shape;
    }
    interface Value {
        readonly tensor?: Tensor;
        readonly from: number;
        readonly to: ReadonlyArray<number>;
        readonly type?: ValueType;
    }
    interface Node {
        readonly name: string;
        readonly opType: string;
        readonly inputs: ReadonlyArray<number>;
        readonly outputs: ReadonlyArray<number>;
        readonly attributes: Attribute;
    }
    /**
     * a Transformer is an instance that allows all possible transformation operations that applied to a graph
     */
    interface Transformer {
        removeAllIdentityNodes(): void;
        removeAllDropoutNodes(): void;
    }
    interface Initializer {
        transformGraph(transformer: Transformer): void;
    }
}
export interface Graph {
    getInputIndices(): ReadonlyArray<number>;
    getInputNames(): ReadonlyArray<string>;
    getOutputIndices(): ReadonlyArray<number>;
    getOutputNames(): ReadonlyArray<string>;
    getValues(): ReadonlyArray<Graph.Value>;
    getNodes(): ReadonlyArray<Graph.Node>;
}
export declare const Graph: {
    /**
     * construct a graph from a graph protobuf type
     */
    from: (graphProto: onnx.IGraphProto, initializer?: Graph.Initializer | undefined) => GraphImpl;
};
declare class GraphImpl implements Graph, Graph.Transformer {
    private _allData;
    private _allInputIndices;
    private _allInputNames;
    private _allOutputIndices;
    private _allOutputNames;
    private _nodes;
    constructor(graph: onnx.IGraphProto, graphInitializer?: Graph.Initializer);
    getInputIndices(): ReadonlyArray<number>;
    getInputNames(): ReadonlyArray<string>;
    getOutputIndices(): ReadonlyArray<number>;
    getOutputNames(): ReadonlyArray<string>;
    getValues(): ReadonlyArray<Graph.Value>;
    getNodes(): ReadonlyArray<Graph.Node>;
    private buildGraph;
    private checkIsAcyclic;
    private transformGraph;
    /**
     * finalize the graph.
     *
     * this function should be called after all the transformation completed.
     * this function removes all unnecessary nodes and values from the graph
     */
    finalizeGraph(): void;
    /**
     * Delete the specifed node. Assume the node has only one input and the first output connected to other nodes
     * @param nodeIndex The index of node to be deleted
     */
    private deleteNode;
    removeAllDropoutNodes(): void;
    removeAllIdentityNodes(): void;
}
export {};
