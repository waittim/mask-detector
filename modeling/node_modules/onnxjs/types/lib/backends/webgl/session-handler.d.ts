import { SessionHandler } from '../../backend';
import { Graph } from '../../graph';
import { Operator } from '../../operators';
import { OpSet } from '../../opset';
import { Session } from '../../session';
import { Tensor } from '../../tensor';
import { WebGLBackend } from '../backend-webgl';
import { WebGLInferenceHandler } from './inference-handler';
import { ProgramManager } from './program-manager';
import { TextureLayoutStrategy } from './texture-layout-strategy';
import { TextureManager } from './texture-manager';
import { TextureData } from './types';
export declare class WebGLSessionHandler implements SessionHandler {
    readonly backend: WebGLBackend;
    readonly context: Session.Context;
    programManager: ProgramManager;
    textureManager: TextureManager;
    layoutStrategy: TextureLayoutStrategy;
    textureDataCache: Map<Tensor.Id, TextureData>;
    initializers: Set<Tensor.Id>;
    constructor(backend: WebGLBackend, context: Session.Context);
    createInferenceHandler(): WebGLInferenceHandler;
    onGraphInitialized(graph: Graph): void;
    isInitializer(tensorId: Tensor.Id): boolean;
    getTextureData(tensorId: Tensor.Id): TextureData | undefined;
    setTextureData(tensorId: Tensor.Id, textureData: TextureData): void;
    dispose(): void;
    resolve(node: Graph.Node, opsets: ReadonlyArray<OpSet>): Operator;
}
