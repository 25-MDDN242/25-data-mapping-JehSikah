let sourceFile = "test_img/input_1.jpg";
let maskFile   = "test_img/mask_1.png";
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

let layer = 2;
let counter = 0;

let pixData, maskData;

function draw() {
    let cell = 20;
    let pix = cell/2;
    let lineLoad = 20;

    if(layer == 0) {

        for(let j = counter; j < counter + lineLoad && j < height; j++) {
            /*
            for(let i = counter; i < counter + lineLoad && i < width; i++) {
                rect(i, j, cell, cell);
            }
            */
            
            for(let i = 0; i < width; i++) {
                pixData = sourceImg.get(i, j);
                maskData = maskImg.get(i, j);
                fill(pixData);
                rect(i, j, cell, cell);
            }
           
        }
        counter += lineLoad;
    } else if(layer == 1) {

        for(let i = 0; i <= width; i+=cell){
            for(let j = 0; j <= height; j+=cell) {
                pixData = sourceImg.get(i, j);
                maskData = maskImg.get(i, j);

                fill(pixData);
                rect(i, j, cell, cell);
                //rect(i + cell, j + cell, cell, cell);
            }
        }
    } else if(layer == 2) {
        for(let i = counter; i < counter + cell && i < width; i+=cell){
            for(let j = 0; j <= height; j+=cell) {
                pixData = sourceImg.get(i, j);
                

                fill(pixData);
                rect(i, j, cell, cell);
                //rect(i + cell, j + cell, cell, cell);
            }
        }
        
    } else if(layer == 3) {
        for(let i = counter; i < counter + cell && i < width; i+=cell){
            for(let j = 0; j <= height; j+=cell) {
                maskData = maskImg.get(i, j);
                pixData = sourceImg.get(i, j);
                
                if(maskData[0] > 128) {
                    fill(255, 0, 220);
                    rect(i, j, pix, pix);
                    rect(i + pix, j + pix, pix, pix);

                    fill(0);
                    rect(i + pix, j, pix, pix);
                    rect(i, j + pix, pix, pix);
                }
            }
        }
        
    } else if(layer == 4) {
        for(let i = counter; i < counter + cell && i < width; i+=cell){
            for(let j = 0; j <= height; j+=cell) {
                maskData = maskImg.get(i, j);
                pixData = sourceImg.get(i, j);
                
                if(maskData[0] < 128) {
                    fill(pixData);
                    rect(i, j, pix, pix);
                }
            }
        }
    }

    counter += cell;

    if (layer == 2 && counter > width) {
        layer = 3;
        counter = 0;
    } else if (layer == 3 && counter > width) {
        layer = 4;
        counter = 0;
    }

}