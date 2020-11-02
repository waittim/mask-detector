src="tfjs.min.js"

model = await tf.loadLayersModel('./tfjs-models/model.json');

let img = tf.browser.fromPixels(imgToPredict);
img = tf.image.resizeBilinear(img, [260, 260]);
img = img.expandDims(0).toFloat().div(tf.scalar(255));
const [rawBBoxes, rawConfidences] = model.predict(img);

const bboxes = decodeBBox(anchors, tf.squeeze(rawBBoxes));
const Results = nonMaxSuppression(bboxes, tf.squeeze(rawConfidences), 0.5, 0.5,  width, height);