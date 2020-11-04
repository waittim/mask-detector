
const tractjs = require("tractjs");

tractjs.load("./yolo-fastest.onnx").then((model) => {
  model
    .predict([new tractjs.Tensor(new Float32Array(320 * 512 * 3), [1, 3, 320, 512])])
    .then((preds) => {
      console.log(preds);
    });
});