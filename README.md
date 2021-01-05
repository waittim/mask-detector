# WearMask: Real-time In-browser Face Mask Detection

## [[Webpage]](https://facemask-detection.com) [[arXiv]](https://arxiv.org/abs/2101.00784) 

![products.jpg](https://github.com/waittim/waittim.github.io/raw/master/img/products.jpg)


## Guidance


### Requirements

Please use Python 3.8 with all [requirements.txt](https://github.com/ultralytics/yolov3/blob/master/requirements.txt) dependencies installed, including `torch>=1.6`. Do not use python 3.9.

```bash
$ pip install -r requirements.txt
```


### Modeling

The data has been saved in **../modeling/data/**, if you added any extra image and annotation, please re-run the code in [10-preparation-process.ipynb](https://github.com/waittim/mask-detector/blob/master/modeling/10-preparation-process.ipynb) to get the new training set and test set.

The following steps work on Google Colab.

Training the model: 
```bash
$ python3 train.py --cfg yolo-fastest.cfg --data data/face_mask.data --weights weights/yolo-fastest.weights --epochs 120
```
The training process would cost several hours. When the training ended, you can use `from utils import utils; utils.plot_results()` to get the training graphs.

<img src="https://github.com/waittim/mask-detector/blob/master/modeling/results.png" width="900">

After training, you can get the model weights [best.pt](https://github.com/waittim/mask-detector/blob/master/modeling/weights/best.pt) with its structure [yolo-fastest.cfg](https://github.com/waittim/mask-detector/blob/master/modeling/cfg/yolo-fastest.cfg). You can also use the following code to get the model weights [best.weights](https://github.com/waittim/mask-detector/blob/master/modeling/weights/best.weights) in Darknet format.

```bash
$ python3  -c "from models import *; convert('cfg/yolo-fastest.cfg', 'weights/best.pt')"
```

With the model you got, the inference could be performed directly in this format: `python3 detect.py --source ...` For instance, if you want to use your webcam, please run `python3 detect.py --source 0`.

There are some example cases:
![mask-examples.jpg](https://github.com/waittim/waittim.github.io/raw/master/img/mask-examples.jpg)


If you want to convert the model to the ONNX format, please check [20-PyTorch2ONNX.ipynb](https://github.com/waittim/mask-detector/blob/master/modeling/20-PyTorch2ONNX.ipynb)

### Deployment

The deployment part works based on NCNN and WASM.

At first, you need to compile the NCNN library. For more details, you can visit [Tutorial for compiling NCNN library
](https://waittim.github.io/2020/11/10/build-ncnn/) to find the tutorial.

When the compilation process of NCNN has been completed, you can start to use various tools in the **ncnn/build/tools** folder to help us convert the model. 

For example, you can copy the **yolo-fastest.cfg** and **best.weights** files of the darknet model to the **ncnn/build/tools/darknet**, and use this code to convert to the NCNN model.

```bash
./darknet2ncnn yolo-fastest.cfg best.weights yolo-fastest.param yolo-fastest.bin 1
```

For compacting the model size, you can move the **yolo-fastest.param** and **yolo-fastest.bin** to **ncnn/build/tools**, then run the ncnnoptimize program.

```bash
ncnnoptimize yolo-fastest.param yolo-fastest.bin yolo-fastest-opt.param yolo-fastest-opt.bin 65536 
```

Now you have the **yolo-fastest-opt.param** and **yolo-fastest-opt.bin** as our final model. For making it works in WASM format, you need to re-compile the NCNN library with WASM. you can visit [Tutorial for compiling NCNN with WASM
](https://waittim.github.io/2020/11/15/build-ncnn-wasm/) to find the tutorial. 

Then you need to write a C++ program that calls the NCNN model as input the image data and return the model output. The [C++ code](https://github.com/waittim/facemask-detection/blob/master/yolo.cpp) I used has been uploaded to the [facemask-detection](https://github.com/waittim/facemask-detection) repository. 

Compile the C++ code by `emcmake cmake` and `emmake make`, you can get the **yolo.js**, **yolo.wasm**, **yolo.worker.js** and **yolo.data**. These files are the model in WASM format.

After establishing the webpage, you can test it locally with the following steps:

1. start a HTTP server `python3 -m http.server 8888`
2. launch google chrome browser, open chrome://flags and enable all experimental webassembly features
3. re-launch google chrome browser, open http://127.0.0.1:8888/test.html, and test it on one frame.
4. re-launch google chrome browser, open http://127.0.0.1:8888/index.html, and test it by webcam.

To publish the webpage, you can use Github Pages as a free server. For more details about it, please visit https://pages.github.com/.


## Acknowledgement

The modeling part is modified based on the code from [Ultralytics](https://github.com/ultralytics/yolov3). The model used is modified from the [Yolo-Fastest](https://github.com/dog-qiuqiu/Yolo-Fastest) model shared by dog-qiuqiu. Thanks to [nihui](https://github.com/nihui), the author of NCNN, for her help in the NCNN and WASM approach.




