import { GlslContext, GlslLib, GlslLibRoutine } from './glsl-definitions';
/**
 * GLSL Library responsible for data types and routines for manipulating
 * coordinates and mapping to/from tensor indices
 */
export declare class CoordsGlslLib extends GlslLib {
    returnType: string;
    constructor(context: GlslContext);
    getFunctions(): {
        [name: string]: GlslLibRoutine;
    };
    getCustomTypes(): {};
    /**
     * Produces a function that can map from
     * 2D normalzied coordinates (s,t) to a flat offset
     */
    protected offsetToCoords(): {
        [name: string]: GlslLibRoutine;
    };
    /**
     * Produces a function that can map from
     * 2D normalzied coordinates (s,t) to a flat offset
     */
    protected coordsToOffset(): {
        [name: string]: GlslLibRoutine;
    };
    /**
     * This is the main function to map from the given texture coordiantes (s,t)
     * to logical indices for the output
     * There will only be one single variation of this
     * Also see coordsToOffset and offsetToIndices for input-specific versions
     */
    protected toVec(): {
        [name: string]: GlslLibRoutine;
    };
    /**
     * These are value getter functions generated for each input
     * Each function is hardwired to the name and dimensions of the input
     * An '_T' variation is also produced which accesses values as if the
     * input was transposed
     */
    protected valueFrom(): {
        [name: string]: GlslLibRoutine;
    };
    /**
     * Produces one value getter function for the name and rank given
     * If a transpose is set proper offsetToCoords mapping will be used
     * @param name name of the function
     * @param rank rank of the input
     * @param transpose whether or not should generate a transpose variation
     */
    protected getValueFromSingle(varName: string, rank: number, width: number, height: number, transpose: boolean): string;
}
