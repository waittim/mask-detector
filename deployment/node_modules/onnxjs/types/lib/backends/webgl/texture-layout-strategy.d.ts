/** Layout preferences */
export interface WidthHeightPrefs {
    breakAxis: number;
}
/**
 * TextureLayoutStrategy is an abstraction for different plans
 * for mapping n-dimensional arrays to 2D textures (and back)
 */
export interface TextureLayoutStrategy {
    computeTextureWH(shape: ReadonlyArray<number>, prefs?: WidthHeightPrefs): [number, number];
}
/**
 * This strategy try to find the minimal max(W,H) that fulfills (W * H == totalSize)
 */
export declare class AlwaysKeepOriginalSizeStrategy implements TextureLayoutStrategy {
    maxTextureSize: number;
    constructor(maxTextureSize: number);
    computeTextureWH(shape: ReadonlyArray<number>, prefs?: WidthHeightPrefs): [number, number];
}
