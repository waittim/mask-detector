/**
 * Given a non RGBA shape calculate the R version
 * It is assumed that the dimensions are multiples of given channels
 * NOTE: it is always the last dim that gets packed.
 * @param unpackedShape original shape to create a packed version from
 */
export declare function getPackedShape(unpackedShape: ReadonlyArray<number>): ReadonlyArray<number>;
