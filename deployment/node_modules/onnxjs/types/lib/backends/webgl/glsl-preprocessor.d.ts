import { GlslContext, GlslLib, GlslLibRoutineNode } from './glsl-definitions';
import { ProgramInfo, VariableInfo } from './types';
import { WebGLContext } from './webgl-context';
/**
 * Preprocessor for the additions to the GLSL language
 * It deals with:
 *  @include directives
 *  @inline
 *  Loop unrolling (not implemented)
 *  Macro resolution (not implemented)
 */
export declare class GlslPreprocessor {
    readonly context: GlslContext;
    readonly libs: {
        [name: string]: GlslLib;
    };
    readonly glslLibRoutineDependencyGraph: {
        [routineName: string]: GlslLibRoutineNode;
    };
    constructor(glContext: WebGLContext, programInfo: ProgramInfo);
    preprocess(): string;
    protected getImports(script: string): string;
    private selectGlslLibRoutinesToBeIncluded;
    protected getUniforms(samplers?: string[], variables?: VariableInfo[]): string;
}
