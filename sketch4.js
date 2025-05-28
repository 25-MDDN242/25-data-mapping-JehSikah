let sourceFile = "test_img/input_3.jpg";
let maskFile   = "test_img/mask_3.png";
let outputFile = "output_1.png";

let renderCounter = 0;

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

    maskCenterSearcher(10);
    maskSizeFinder(10);
}

let layer = -2;
let pix, mask;
let num_lines_to_draw = 40;
let skip = 1;

function colorCheck(value) {
    let newValue;
    if (value > 128) {
        newValue = 255;
    } else {
        newValue = 100;
    }

    return newValue;
}

function draw() {
    
    if (layer == -2) {
        for(let j=renderCounter; j<renderCounter+num_lines_to_draw && j<Y_STOP; j++) {
            for(let i=0; i<X_STOP; i++) {
                colorMode(RGB);
                // draw a "dimmed" version in gray
                

                mask = maskImg.get(i, j);
                if (mask[1] < 128) {
                    pix = sourceImg.get(i, j);
                } 
                else {
                    /*
                    pix = sourceImg.get(i, j);
                    let col = color(pix);

                    let h = hue(col);
                    let s = saturation(col);
                    let l = brightness(col);

                    let bri = map(l, 0, 100, 30, 70);
                    pix = color(h, s, bri);
                    */

                    pix = sourceImg.get(i, j);
                    let col = color(pix);

                    let r = red(col);
                    let g = green(col);
                    let b = blue(col);

                    pix = color(colorCheck(r), colorCheck(g), colorCheck(b));
                }
                set(i, j, pix);
            }
        }
        renderCounter = renderCounter + num_lines_to_draw;
        updatePixels();
    } 

    if (layer == -1) {
        for(let j = renderCounter; j < renderCounter + num_lines_to_draw && j < height; j+=boxSize) {
            for(let i = 0; i < width; i+=skip) {
                mask = maskImg.get(i, j);
                if (mask[1] > 128) {
                    pix = sourceImg.get(i, j);
                    fill(pix);
                    rect(i, j, boxSize, boxSize);
                    skip = boxSize;
                }
            }
        }
        renderCounter += num_lines_to_draw;
    }
    
    // scan image and colour in not masked
    else if (layer == 0) {

        for(let j=renderCounter; j<renderCounter+num_lines_to_draw && j<Y_STOP; j++) {
            for(let i=0; i<X_STOP; i++) {
                colorMode(RGB);
                mask = maskImg.get(i, j);
                if (mask[1] < 128) {
                    pix = sourceImg.get(i, j);
                }
                else {
                    //draw in mask
                    //pix = sourceImg.get(i, j);
                    pix = [150, 0, 0, 255]
                }
                set(i, j, pix);
            }
        }
        renderCounter = renderCounter + num_lines_to_draw;
        updatePixels();
    }

    //fill mask w/ missingTxture
    else if (layer == 1) {
        
        for(let j = renderCounter; j < renderCounter + num_lines_to_draw && j < Y_STOP; j+=gap) {
            for(let i=0; i < X_STOP; i += gap) {
                mask = maskImg.get(i, j);
                if (mask[0] > 128) {
                    missingTexture(i, j);
                    missingTexture(-i, j);
                    missingTexture(i, -j);
                    missingTexture(-i, -j);
                }
            }
        }
        renderCounter = renderCounter + num_lines_to_draw;
    }


    else if (layer == 2) {

        for(let i=0;i<5;i++) {
            let x = floor(random(sourceImg.width));
            let y = floor(random(sourceImg.height));
            let x2, y2;
            mask = maskImg.get(x, y);
            let rVert = int(random(30));
            let rHor = int(random(30));
            let check = dist(x, y, maskCenter[0], maskCenter[1]);
            
            if (check < 500 && mask[0] < 128) {
                pix = sourceImg.get(x, y);
                rectMode(CENTER);
                strokeCap(SQUARE);
                strokeWeight(5);
                stroke(pix)
                fill(pix);
                rect(x, y, boxSize +rVert, boxSize +rHor);
                if (x < maskCenter[0]) {
                    x2 = x + 30;
                } else {
                    x2 = x - 30;
                }

                if (y < maskCenter[1]) {
                    y2 = y + 30;
                } else {
                    y2 = y - 30;
                }
                line(x, y, x2, y2);
            }
        }
        renderCounter++;
    }




    let mouseChecker = dist(mouseX, mouseY, maskCenter[0], maskCenter[1]);
    //console.log("Dist; " + mouseChecker);


    if (layer == 0 && renderCounter > 1920) {
        layer = 1;
        renderCounter = 0;
    }
    else if (layer == 1 && renderCounter > 1920) {
        layer = 2;
        renderCounter = 0;
    }
    else if (layer == 2 && renderCounter > 500) {
        layer = 3;
        renderCounter = 0;
    }
    else if (layer == -1 && renderCounter > 1920) {
        layer = 2;
        renderCounter = 0;
    }
    else if (layer == -2 && renderCounter > 1920) {
        layer = -1;
        renderCounter = 0;
    }

    
}
let boxSize = 10;
let gap = boxSize*2;

function missingTexture(i, j) {
    
    fill(255, 0, 220); //missing texture purp
    rect(i-boxSize, j-boxSize, boxSize, boxSize);
    rect(i, j, boxSize, boxSize);

    fill(0); //missing texture purp
    rect(i, j-boxSize, boxSize, boxSize);
    rect(i-boxSize, j, boxSize, boxSize);
}


let maskCenter = null; // this will be updated to be an array with 2 Variables in it. maskCenter[0] will be the X, and maskCenter[1] will be the Y.
let maskCenterSize = null; // same as above ^^
let X_STOP = 1920;
let Y_STOP = 1080;

function maskCenterSearcher(min_width) {
    // we store the sum of x,y whereever the mask is on
    // at the end we divide to get the average
    let mask_x_sum = 0;
    let mask_y_sum = 0;
    let mask_count = 0;

    // first scan all rows top to bottom
    print("Scanning mask top to bottom...")
    for(let j=0; j<Y_STOP; j++) {
        // look across this row left to right and count
        for(let i=0; i<X_STOP; i++) {
            let maskData = maskImg.get(i, j);

            if (maskData[1] > 128) {
                mask_x_sum = mask_x_sum + i;
                mask_y_sum = mask_y_sum + j;
                mask_count = mask_count + 1;
            }
        }
    }

    print("Mask Center Located!")
    if (mask_count > min_width) {
        let avg_x_pos = int(mask_x_sum / mask_count);
        let avg_y_pos = int(mask_y_sum / mask_count);
        maskCenter = [avg_x_pos, avg_y_pos];
        print("Center set to: " + maskCenter);
    }
}

function maskSizeFinder(min_width) {
    let max_up_down = 0;
    let max_left_right = 0;

    // first scan all rows top to bottom
    print("Scanning mask top to bottom...")

    for(let j=0; j<Y_STOP; j++) {
        // look across this row left to right and count
        let mask_count = 0;
        for(let i=0; i<X_STOP; i++) {
            let mask = maskImg.get(i, j);
            if (mask[1] > 128) {
                mask_count = mask_count + 1;
            }
        }
        // check if that row sets a new record
        if (mask_count > max_left_right) {
            max_left_right = mask_count;
        }
    }
    // now scan once left to right as well
    print("Scanning mask left to right...")
    for(let i=0; i<X_STOP; i++) {
        // look across this column up to down and count
        let mask_count = 0;
        for(let j=0; j<Y_STOP; j++) {
            let mask = maskImg.get(i, j);
            if (mask[1] > 128) {
                mask_count = mask_count + 1;
            }
        }
        // check if that row sets a new record
        if (mask_count > max_up_down) {
            max_up_down = mask_count;
        }
    }
    print("Scanning mask done!")

    if (max_left_right > min_width && max_up_down > min_width) {
        maskCenterSize = [max_left_right, max_up_down];
    }
}

function keyTyped() {
    if (key == '!') {
      saveBlocksImages();
    }
}