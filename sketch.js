let sourceImg=null;
let maskImg=null;
let renderCounter=0;

let layerCount = 0;

// change these three lines as appropiate
let sourceFile = "input_1.jpg";
let maskFile   = "mask_1.png";
let outputFile = "output_1.png";

function preload() {
  sourceImg = loadImage(sourceFile);
  maskImg = loadImage(maskFile);
  //console.log(p5.Renderer2D);
}

function setup() {
  let main_canvas = createCanvas(1920, 1080);
  main_canvas.parent('canvasContainer');

  imageMode(CENTER);
  angleMode(DEGREES);
  noStroke();
  background(0, 0, 0);
  sourceImg.loadPixels();
  maskImg.loadPixels();
}

function draw() {
  //draw missing texture background
  if (layerCount == 0) {
    let fade = map(renderCounter, 0, 100, 255, 0);

    missingTexture();
    fill(0, 0, 0, fade);
    rect(0, 0, width, height);

    renderCounter++;
  } else if (layerCount == 1) {
    for(let i=0;i<10;i++) {
      randPixel(0);
    }

    renderCounter++;
  } else if (layerCount == 2) {
    for(let i=0;i<10;i++) {
        randPixel();
    	}

    renderCounter++;
  } else if (layerCount == 3) {
    

    renderCounter++;
  } else if (layerCount == 20) {
    console.log("Done!")
    noLoop();
    // uncomment this to save the result
    // saveArtworkImage(outputFile);
  }


  if (layerCount == 0 && renderCounter > 100) {
    layerCount = 1;
    renderCounter = 0;
  } else if (layerCount == 1 && renderCounter > 1500) {
    layerCount = 2;
    renderCounter = 0;
  } else if (layerCount == 2 && renderCounter > 1500) {
    layerCount = 20;
    renderCounter = 0;
  }

  console.log("Layer: " + layerCount + "  Render: " + renderCounter);
  
}

function missingTexture() {
  let boxSize = 20;
  let gap = boxSize*2;

  fill(255, 0, 220); //missing texture purp
  for(let i = 0; i <= width; i+=gap){
    for(let j = 0; j <= height; j+=gap)
    rect(i, j, boxSize, boxSize);
  }

  for(let i = 0; i <= width; i+=gap){
    for(let j = 0; j <= height; j+=gap)
    rect(i + boxSize, j + boxSize, boxSize, boxSize);
  }
}

function randPixel(filler) {
  let x = floor(random(sourceImg.width));
  let y = floor(random(sourceImg.height));
  let pixData = sourceImg.get(x, y);
  let maskData = maskImg.get(x, y);

  if (filler === undefined) {
    fill(pixData);
  } else {
    fill(filler)
  }

  if(maskData[0] < 128) {
    let pointSize = 20;
    push();
    rectMode(CENTER);
    // strokeWeight(0.5);
    // stroke(0);
    rect(x, y, pointSize);
    pop();
  }
}

function keyTyped() {
  if (key == '!') {
    saveBlocksImages();
  }
}
