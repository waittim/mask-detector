"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.conv2d = exports.CpuConv = void 0;
var conv_1 = require("../../../ops/conv");
var tensor_1 = require("../../../tensor");
var util_1 = require("../../../util");
var matmul_1 = require("./matmul");
var CpuConv = /** @class */ (function (_super) {
    __extends(CpuConv, _super);
    function CpuConv() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CpuConv.prototype.run = function (inferenceHandler, inputs) {
        var x = inputs[0];
        var w = inputs[1];
        var b = inputs.length === 3 ? inputs[2] : undefined;
        // if kernelShape is not specified in the attributes of this op, infer it from the weight tensor dims
        if (this.kernelShape.length === 0) {
            var wDims = inputs[1].dims;
            for (var i = 2; i < wDims.length; ++i) {
                this.kernelShape.push(wDims[i]);
            }
        }
        // create output Tensor after determining output size (after adjusting pads based on 'autoPad' attribute)
        var outputDims = util_1.PoolConvUtil.computeConvOutputShape(x.dims, w.dims, this.strides, this.dilations, this.kernelShape, this.pads, this.autoPad);
        var y = new tensor_1.Tensor(outputDims, x.type);
        conv2d(y, x, w, b, this.dilations, this.group, this.pads, this.strides);
        return [y];
    };
    return CpuConv;
}(conv_1.Conv));
exports.CpuConv = CpuConv;
// tslint:disable: variable-name
function conv2d(Y, X, W, B, dilations, group, pads, strides) {
    var input_num = X.dims[0];
    var input_channels = X.dims[1];
    var input_height = X.dims[2];
    var input_width = X.dims[3];
    var filter_num = W.dims[0];
    var filter_channels = W.dims[1];
    var filter_height = W.dims[2];
    var filter_width = W.dims[3];
    var filter_size = filter_num * filter_channels * filter_height * filter_width;
    var kernel_shape = [filter_height, filter_width];
    var output_num = Y.dims[0];
    var output_channels = Y.dims[1];
    var output_height = Y.dims[2];
    var output_width = Y.dims[3];
    var output_size = output_num * output_channels * output_height * output_width;
    var input_image_size = input_height * input_width;
    var output_image_size = output_height * output_width;
    var kernel_size = kernel_shape[0] * kernel_shape[1];
    var X_offset = input_channels / group * input_image_size;
    var Y_offset = output_size / output_num / group;
    var W_offset = filter_size / group;
    var kernel_dim = input_channels / group * kernel_size;
    var col_buffer_size = kernel_dim * output_image_size;
    var col_buffer_data = new Float32Array(col_buffer_size);
    for (var image_id = 0; image_id < input_num; ++image_id) {
        var X_image_offset = 0;
        var Y_image_offset = 0;
        for (var group_id = 0; group_id < group; ++group_id) {
            im2col(X.floatData.subarray(X_image_offset + group_id * X_offset), col_buffer_data, input_channels / group, input_height, input_width, kernel_shape[0], kernel_shape[1], dilations[0], dilations[1], pads[0], pads[1], pads[2], pads[3], strides[0], strides[1]);
            matmul_1.matMul2d(W.floatData.subarray(group_id * W_offset), col_buffer_data, Y.floatData.subarray(Y_image_offset + group_id * Y_offset), false, false, 1, 0, filter_num / group, output_image_size, kernel_dim);
        }
        X_image_offset += X_offset * group;
        Y_image_offset += Y_offset * group;
    }
    // Add bias if applicable
    if (B) {
        var biasData = B.floatData;
        var outputData = Y.floatData;
        var batchSize = Y.dims[0];
        var outputChannels = Y.dims[1];
        var channelSize = Y.dims[2] * Y.dims[3];
        var dataSize = outputChannels * channelSize;
        for (var batch = 0; batch < batchSize; ++batch) {
            for (var channel = 0; channel < outputChannels; ++channel) {
                var offset = batch * dataSize + channel * channelSize;
                for (var index = 0; index < channelSize; ++index) {
                    outputData[offset + index] += biasData[channel];
                }
            }
        }
    }
}
exports.conv2d = conv2d;
function im2col(data_im, data_col, channels, height, width, kernel_h, kernel_w, dilation_h, dilation_w, pad_t, pad_l, pad_b, pad_r, stride_h, stride_w) {
    var output_h = ~~((height + pad_b + pad_t - (dilation_h * (kernel_h - 1) + 1)) / stride_h) + 1;
    var output_w = ~~((width + pad_l + pad_r - (dilation_w * (kernel_w - 1) + 1)) / stride_w) + 1;
    // Fast path for zero padding and no dilation
    // From Torch, THNN_(unfolded_copy)
    if (dilation_h === 1 && dilation_w === 1 && pad_l === 0 && pad_r === 0 && pad_t === 0 && pad_b === 0) {
        for (var k = 0; k < channels * kernel_h * kernel_w; k++) {
            var nip = ~~(k / (kernel_h * kernel_w));
            var rest = k % (kernel_h * kernel_w);
            var kh = ~~(rest / kernel_w);
            var kw = rest % kernel_w;
            var dst_offset = nip * (kernel_h * kernel_w * output_h * output_w) + kh * (kernel_w * output_h * output_w) +
                kw * (output_h * output_w);
            var src_offset = nip * (height * width);
            for (var y = 0; y < output_h; y++) {
                var iy = y * stride_h + kh;
                var ix = kw;
                if (stride_w === 1) {
                    data_col.set(data_im.subarray(src_offset + iy * width + ix, src_offset + iy * width + ix + output_w), dst_offset + y * output_w);
                }
                else {
                    for (var x = 0; x < output_w; x++) {
                        data_col[dst_offset + (y * output_w + x)] = data_im[src_offset + (iy * width + ix + x * stride_w)];
                    }
                }
            }
        }
        return;
    }
    // Baseline
    var dkernel_h = dilation_h * (kernel_h - 1) + 1;
    var dkernel_w = dilation_w * (kernel_w - 1) + 1;
    var height_col = ~~((height + pad_t + pad_b - dkernel_h) / stride_h) + 1;
    var width_col = ~~((width + pad_l + pad_r - dkernel_w) / stride_w) + 1;
    var channels_col = channels * kernel_h * kernel_w;
    for (var c = 0; c < channels_col; ++c) {
        var w_offset = c % kernel_w;
        var h_offset = ~~(c / kernel_w) % kernel_h;
        var c_im = ~~(c / (kernel_h * kernel_w));
        for (var h = 0; h < height_col; ++h) {
            for (var w = 0; w < width_col; ++w) {
                var h_pad = h * stride_h - pad_t + h_offset * dilation_h;
                var w_pad = w * stride_w - pad_l + w_offset * dilation_w;
                if (h_pad >= 0 && h_pad < height && w_pad >= 0 && w_pad < width) {
                    data_col[(c * height_col + h) * width_col + w] = data_im[(c_im * height + h_pad) * width + w_pad];
                }
                else {
                    data_col[(c * height_col + h) * width_col + w] = 0;
                }
            }
        }
    }
}
//# sourceMappingURL=conv.js.map