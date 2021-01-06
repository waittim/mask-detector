Attention: this folder is not about the in-browser deployment but about the Flask deployment. For in-browser solution, please check [facemask-detection](https://github.com/waittim/facemask-detection).


## Requirements

Python 3.8, do not use python 3.9, with all [requirements.txt](https://github.com/ultralytics/yolov3/blob/master/requirements.txt) dependencies installed, including `torch>=1.6`. To install run:
```bash
$ pip install -r requirements.txt
```


## Inference by Flask for single image

```bash
python3 predict_server.py
```
- Then enter http://localhost:2222/upload 


