import { ProgramInfo } from './types';
import { WebGLContext } from './webgl-context';
export declare enum FunctionType {
    ValueBased = 0,
    Positional = 1
}
export interface GlslFunction<T extends FunctionType> {
    body: string;
    name: string;
    type: T;
}
export interface GlslValueFunction extends GlslFunction<FunctionType.ValueBased> {
}
export interface GlslPositionalFunction extends GlslFunction<FunctionType.Positional> {
    inputShape: ReadonlyArray<number>;
    outputShape: ReadonlyArray<number>;
}
export declare class GlslContext {
    glContext: WebGLContext;
    programInfo: ProgramInfo;
    constructor(glContext: WebGLContext, programInfo: ProgramInfo);
}
export declare abstract class GlslLib {
    context: GlslContext;
    constructor(context: GlslContext);
    abstract getFunctions(): {
        [name: string]: GlslLibRoutine;
    };
    abstract getCustomTypes(): {
        [name: string]: string;
    };
}
export declare class GlslLibRoutine {
    routineBody: string;
    dependencies?: string[] | undefined;
    constructor(routineBody: string, dependencies?: string[] | undefined);
}
export declare class GlslLibRoutineNode {
    name: string;
    dependencies: GlslLibRoutineNode[];
    routineBody: string;
    constructor(name: string, routineBody?: string, dependencies?: GlslLibRoutineNode[]);
    addDependency(node: GlslLibRoutineNode): void;
}
export declare class TopologicalSortGlslRoutines {
    static returnOrderedNodes(nodes: GlslLibRoutineNode[]): GlslLibRoutineNode[];
    private static createOrderedNodes;
    private static dfsTraverse;
}
