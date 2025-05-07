let sourceImg=null;
let maskImg=null;
let renderCounter=0;

// change these three lines as appropiate
let sourceFile = "input_3.jpg";
let maskFile   = "mask_3.png";
let outputFile = "output_3.png";

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
      let pointSize = 30;
      //ellipse(x, y, pointSize, pointSize);
      arc(x, y, pointSize, pointSize, aStart, aStop);
    }
    else {
      //let pointSize = 10;
      //ellipse(x, y, pointSize, pointSize);
      set
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

function keyTyped() {
  if (key == '!') {
    saveBlocksImages();
  }
}
