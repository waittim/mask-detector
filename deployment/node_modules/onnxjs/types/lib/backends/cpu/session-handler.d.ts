import { Backend, InferenceHandler, SessionHandler } from '../../backend';
import { Graph } from '../../graph';
import { Operator } from '../../operators';
import { OpSet } from '../../opset';
import { Session } from '../../session';
export declare class CpuSessionHandler implements SessionHandler {
    readonly backend: Backend;
    readonly context: Session.Context;
    constructor(backend: Backend, context: Session.Context);
    createInferenceHandler(): InferenceHandler;
    dispose(): void;
    resolve(node: Graph.Node, opsets: ReadonlyArray<OpSet>): Operator;
}
