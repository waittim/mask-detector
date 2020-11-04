import { Backend, InferenceHandler, SessionHandler } from '../../backend';
import { Graph } from '../../graph';
import { Operator } from '../../operators';
import { OpSet } from '../../opset';
import { Session } from '../../session';
export declare class WasmSessionHandler implements SessionHandler {
    readonly backend: Backend;
    readonly context: Session.Context;
    private opResolveRules;
    constructor(backend: Backend, context: Session.Context, fallbackToCpuOps: boolean);
    createInferenceHandler(): InferenceHandler;
    dispose(): void;
    resolve(node: Graph.Node, opsets: ReadonlyArray<OpSet>): Operator;
}
