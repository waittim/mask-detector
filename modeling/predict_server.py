import json
import argparse
from flask import Flask, jsonify, request, redirect, url_for, render_template, flash
from werkzeug.utils import secure_filename
import os
import numpy as np
import cv2
#from predict_bdr import *
import time
from datetime import timedelta
from detect1 import *
app = Flask(__name__)

UPLOAD_FOLDER = 'upload'  # uploading dir
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}  # legal file type

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = timedelta(seconds=5)
print(app.config['SEND_FILE_MAX_AGE_DEFAULT'])




def allow_filename(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/upload', methods=['GET', 'POST'])
def upload():
    if request.method == 'POST':
        if 'file' not in request.files:
            flash('not file part!')
            return redirect(request.url)

        f = request.files['file']
        if f.filename == '':
            flash('not file upload')
            return redirect(request.url)

        if f and allow_filename(f.filename):
            filename = secure_filename(f.filename)

            filepath = './' + app.config['UPLOAD_FOLDER'] + '/' + f.filename
            f.save(filepath)

            temp = str(detect(save_img = True, out = "static/images", source = filepath))

            if "NoMask" in temp:
                return render_template('upload_ok_Nomask.html')
            else:
                return render_template('upload_ok_mask.html')
    return render_template('upload.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=2222)