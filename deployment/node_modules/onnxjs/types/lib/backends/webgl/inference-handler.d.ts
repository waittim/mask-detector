import { InferenceHandler } from '../../backend';
import { Tensor } from '../../tensor';
import { WebGLSessionHandler } from './session-handler';
import { WidthHeightPrefs } from './texture-layout-strategy';
import { TextureData, TextureLayout, WebGLOperator } from './types';
export declare class WebGLInferenceHandler implements InferenceHandler {
    session: WebGLSessionHandler;
    private textureDataCache;
    constructor(session: WebGLSessionHandler);
    run(op: WebGLOperator, inputs: Tensor[]): Tensor[];
    /**
     * Create a TextureData object from a tensor.
     * Usage = Encoder.Usage.UploadOnly.
     * If a related texture data is found in cache, returns it;
     * Otherwise:
     *   Creates a new texture layout if not provided;
     *   Creates WebGLTexture with the layout;
     *   Upload tensor data to the texture;
     *   Creates a texture data object associated with the given tensor.
     * @param tensor the tensor with data to upload
     */
    getOrCreateTextureData(tensor: Tensor, layout?: TextureLayout): TextureData;
    /**
     * Create a TextureData object from the given data type and texture layout.
     * Usage = Encoder.Usage.Default.
     * @param dataType the tensor data type
     */
    createTextureDataFromLayout(layout: TextureLayout, dataType: Tensor.DataType): TextureData;
    /**
     * Create a TextureData object using the given data and bind to the given tensor.
     * Usage = Encoder.Usage.UploadOnly.
     * NOTE: this function is a hack for Conv implementation. should remove this function, after rewriting Conv
     * implementation by Graph.Transformer
     * @param dataType the tensor data type
     * @param data the actual data to upload
     * @param tensor the tensor to bind. tensor's data is ignored.
     */
    createTextureDataFromLayoutBindTensor(layout: TextureLayout, dataType: Tensor.DataType, data: Tensor.NumberType, tensor: Tensor): TextureData;
    private createTextureData;
    /**
     * Create a TextureData object, using the given texture.
     * This function does not create new texture. Usually used in scenarios using texture sharing. (eg. Reshape)
     * @param dataType the tensor data type
     * @param texture the WebGLTexture object to share
     * @param tensorId the tensor ID of the shared tensor data
     */
    createSharedTextureData(layout: TextureLayout, dataType: Tensor.DataType, texture: WebGLTexture, tensorId: Tensor.Id): TextureData;
    private createTextureDataFromTexture;
    getTextureData(tensorId: Tensor.Id): TextureData | undefined;
    setTextureData(tensorId: Tensor.Id, td: TextureData): void;
    /**
     * Create a TextureLayout object from a tensor. If a related texture data is found, returns the cached texture layout.
     */
    getOrCreateTextureLayout(tensor: Tensor, channels?: 1 | 2 | 3 | 4, unpackedShape?: ReadonlyArray<number>): TextureLayout;
    /**
     * Create a TextureLayout object from shape.
     */
    createTextureLayoutFromShape(shape: ReadonlyArray<number>, channels?: 1 | 2 | 3 | 4, unpackedShape?: ReadonlyArray<number>, prefs?: WidthHeightPrefs): TextureLayout;
    dispose(): void;
    readTexture(textureData: TextureData): Tensor.NumberType;
}
