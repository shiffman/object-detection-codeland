// Real-Time Object Detection with TensorFlow.js + p5.js
// Made at Codeland Conference in Workshop
// https://codelandconf.com/speakers/nicholas-bourdakos/

const MODEL_URL = 'model_web/'
const LABELS_URL = MODEL_URL + 'labels.json'
const MODEL_JSON = MODEL_URL + 'model.json'

let video;
let model;
let thumbs = [];
let labels = ['👍', '👎']

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO, ready);
  video.hide();
}

function ready() {
  startTF();
}

function draw() {
  background(0);
  image(video, 0, 0);
  for (let i = 0; i < thumbs.length; i++) {
    const thumb = thumbs[i];
    let box = thumb.bbox;
    stroke(255);
    noFill();
    strokeWeight(4);
    rect(box[0], box[1], box[2], box[3]);
    textSize(64);
    fill(255);
    text(labels[thumb.class], box[0] + 20, box[1] + 64);
  }
}

async function startTF() {
  const modelPromise = tf.loadGraphModel(MODEL_JSON)
  const labelsPromise = fetch(LABELS_URL).then(data => data.json())
  const values = await Promise.all([modelPromise, labelsPromise]);
  [model] = values;
  detectFrame(video, model);
}

async function detectFrame(video, model) {
  thumbs = await TFWrapper(model).detect(video.elt);
  detectFrame(video, model);
}

