let sourceImg=null;
let maskImg=null;
let renderCounter=0;

// change these three lines as appropiate
let sourceFile = "input_1.jpg";
let maskFile   = "mask_1.png";
let outputFile = "output_1.png";

function preload() {
  sourceImg = loadImage(sourceFile);
  maskImg = loadImage(maskFile);
  //console.log(p5.Renderer2D);

}
function setup () {
  let main_canvas = createCanvas(1920, 1080);
  main_canvas.parent('canvasContainer');

  imageMode(CENTER);
  angleMode(DEGREES);
  noStroke();
  //background(100, 0, 200);
  background(0, 0, 0);
  sourceImg.loadPixels();
  maskImg.loadPixels();
}

function draw () {

  if (renderCounter == 0) {
    //missing();
  }

  for(let i=0;i<4000;i++) {
    
    let x = floor(random(sourceImg.width));
    let y = floor(random(sourceImg.height));
    let pixData = sourceImg.get(x, y);
    let maskData = maskImg.get(x, y);

    let aStart = floor(random(360));
    let aStop = floor(random(360));

    let line1 = floor(random(20));
    let line2 = floor(random(20));

    fill(pixData);
    if(maskData[0] < 128) {
      let pointSize = 20;
      //ellipse(x, y, pointSize, pointSize);
      arc(x, y, pointSize, pointSize, aStart, aStop);
      // push();
      // rectMode(CENTER);
      // strokeWeight(0.5);
      // stroke(0);
      // rect(x, y, pointSize);
      // pop();
    }
    else {
      // let pointSize = 3;
      // ellipse(x, y, pointSize, pointSize);
      push();
      stroke(pixData);
      line(x + line1, y + line1, x - line2, y - line2);
      pop();
    }
  }
  renderCounter = renderCounter + 1;
  if(renderCounter > 10) {
    console.log("Done!")
    noLoop();
    // uncomment this to save the result
    // saveArtworkImage(outputFile);
  }
}

function missing() {
  push();
  noStroke();

  fill(255, 0, 220);
  let boxSize = 30;
  let gap = boxSize*2;

  for(let i = 0; i <= width; i+=gap){
    for(let j = 0; j <= height; j+=gap)
    rect(i, j, boxSize, boxSize);
  }

  for(let i = 0; i <= width; i+=gap){
    for(let j = 0; j <= height; j+=gap)
    rect(i + boxSize, j + boxSize, boxSize, boxSize);
  }
  
  pop();
}

function keyTyped() {
  if (key == '!') {
    saveBlocksImages();
  }
}
