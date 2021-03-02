
## Requirements

Python 3.8, do not use python 3.9, with all [requirements.txt](https://github.com/ultralytics/yolov3/blob/master/requirements.txt) dependencies installed, including `torch>=1.6`. To install run:
```bash
$ pip install -r requirements.txt
```


## Tutorials

* [Notebook](https://github.com/ultralytics/yolov3/blob/master/tutorial.ipynb) <a href="https://colab.research.google.com/github/ultralytics/yolov3/blob/master/tutorial.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open In Colab"></a>
* [Train Custom Data](https://github.com/ultralytics/yolov3/wiki/Train-Custom-Data) << highly recommended
* [Docker Quickstart Guide](https://github.com/ultralytics/yolov3/wiki/Docker-Quickstart)  ![Docker Pulls](https://img.shields.io/docker/pulls/ultralytics/yolov3?logo=docker)


## Training

**Start Training:** `python3 train.py` to begin training after downloading COCO data with `data/get_coco2017.sh`. Each epoch trains on 117,263 images from the train and validate COCO sets, and tests on 5000 images from the COCO validate set.

**Resume Training:** `python3 train.py --resume` to resume training from `weights/last.pt`.

**Plot Training:** `from utils import utils; utils.plot_results()`


<img src="https://github.com/waittim/mask-detector/blob/master/modeling/results.png" width="900">


### Image Augmentation

`datasets.py` applies OpenCV-powered (https://opencv.org/) augmentation to the input image. We use a **mosaic dataloader** to increase image variability during training.

<img src="https://github.com/waittim/mask-detector/blob/master/modeling/test_batch0_gt.jpg" width="900">



## Inference

```bash
python3 detect.py --source ...
```

- Image:  `--source file.jpg`
- Video:  `--source file.mp4`
- Directory:  `--source dir/`
- Webcam:  `--source 0`
- RTSP stream:  `--source rtsp://170.93.143.139/rtplive/470011e600ef003a004ee33696235daa`
- HTTP stream:  `--source http://112.50.243.8/PLTV/88888888/224/3221225900/1.m3u8`


**YOLO-Fastest with webcam:** `python3 detect.py --source 0`

**YOLO-Fastest onnx model with webcam:** `python3 detect_onnx.py --source 0`


## Darknet Conversion

```bash

# convert darknet cfg/weights to pytorch model
$ python3  -c "from models import *; convert('cfg/yolo-fastest.cfg', 'weights/best.weights')"
Success: converted 'weights/best.pt' to 'weights/best.pt'

# convert cfg/pytorch model to darknet weights
$ python3  -c "from models import *; convert('cfg/yolo-fastest.cfg', 'weights/best.pt')"
Success: converted 'weights/best.pt' to 'weights/best.weights'
```

## Reproduce Our Environment

To access an up-to-date working environment (with all dependencies including CUDA/CUDNN, Python and PyTorch preinstalled), consider a:

- **GCP** Deep Learning VM with $300 free credit offer: See our [GCP Quickstart Guide](https://github.com/ultralytics/yolov3/wiki/GCP-Quickstart) 
- **Google Colab Notebook** with 12 hours of free GPU time. <a href="https://colab.research.google.com/github/ultralytics/yolov3/blob/master/tutorial.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open In Colab"></a>
- **Docker Image** https://hub.docker.com/r/ultralytics/yolov3. See [Docker Quickstart Guide](https://github.com/ultralytics/yolov3/wiki/Docker-Quickstart) ![Docker Pulls](https://img.shields.io/docker/pulls/ultralytics/yolov3?logo=docker)



