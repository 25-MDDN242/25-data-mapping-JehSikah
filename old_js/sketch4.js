let sourceFile = "mince_fail/input_new2.jpg";
let maskFile   = "mince_fail/mask_new2.png";
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

let layer = -3;
let pix, mask;
let num_lines_to_draw = 40;
let skip = 1;
let swap = true;

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
    
    if (layer == -3) {
        for(let j=renderCounter; j<renderCounter+num_lines_to_draw && j<Y_STOP; j++) {
            for(let i=0; i<X_STOP; i++) {                
                colorMode(RGB);
                pix = sourceImg.get(i, j);
                // create a color from the values (always RGB)
                let col = color(pix);
                //let maskData = maskImg.get(i, j);
                
                colorMode(HSB, 360, 100, 100);
                // draw a "dimmed" version in gray
                let h = hue(col);
                let s = saturation(col);
                let b = brightness(col);
                
                let new_brt = map(b, 0, 100, 0, 30);
                let new_col = color(h, 0, new_brt);
                set(i, j, new_col);
                colorMode(RGB);
            }
        }
        renderCounter += num_lines_to_draw;
        updatePixels();
    } 
    else if (layer == -2) {
        for(let j=renderCounter; j<renderCounter+num_lines_to_draw && j<Y_STOP; j++) {
            for(let i=0; i<X_STOP; i++) {
                colorMode(RGB);

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
        renderCounter += num_lines_to_draw;
        updatePixels();
    } 

    if (layer == -1) {
        for(let j = renderCounter; j < renderCounter + num_lines_to_draw && j < height; j+=boxSize) {
            for(let i = 0; i < width; i+=skip) {
                mask = maskImg.get(i, j);
                if (mask[1] > 128) {
                    //pix = sourceImg.get(i, j);
                    fill(0);
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
        renderCounter += num_lines_to_draw;
        updatePixels();
    }

    //fill mask w/ missingTxture
    else if (layer == 1) {
        
        for(let j = renderCounter; j < renderCounter + num_lines_to_draw && j < Y_STOP; j+=gap) {
            for(let i=0; i < X_STOP; i += gap) {
                mask = maskImg.get(i, j);
                let check = dist(i, j, maskCenter[0], maskCenter[1]);
                if (mask[0] > 128 && check < 300) {
                    missingTexture(i, j);
                }
            }
        }
        renderCounter += num_lines_to_draw;
    }

    // circle of random sized pixels around mask 
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
                //line(x, y, x2, y2);
                noStroke();
            }

        }
        renderCounter++;
    }

    //fill with pixels
    //densest/biggest around mask, mid under 2*mask size, outlines of colour 4*mask size
    else if (layer == 3) {
        for(let i=0;i<20;i++) {
            let x = floor(random(sourceImg.width));
            let y = floor(random(sourceImg.height));
            let check = dist(x, y, maskCenter[0], maskCenter[1]);
            let rVert, rHor;
            mask = maskImg.get(x, y);
            pix = sourceImg.get(x, y);
            rectMode(CENTER);
            strokeCap(SQUARE);

            let centerAv = (maskCenterSize[0] + maskCenterSize[0])/2;
            let pixData = sourceImg.get(x, y);
            let col = color(pixData);
                
            colorMode(HSB, 360, 100, 100);
            // draw a "dimmed" version in gray
            let h = hue(col);
            let b = brightness(col);
                
            let new_brt = map(b, 0, 100, 0, 30);
            let new_col = color(h, 0, new_brt);

            let coinFlip;
            colorMode(RGB);
            noStroke();

            if (mask[0] > 128) {
                rVert = int(random(6));
                rHor = int(random(15));
                coinFlip = int(random(2));
                if (coinFlip == 1) {
                    fill(255, 0, 220);
                } else {
                    fill(0);
                } 
            } else if (check < centerAv) {
                rVert = int(random(30));
                rHor = int(random(30));
                fill(pix);
            } else if (check < (centerAv*1.5)) {
                rVert = int(random(20));
                rHor = int(random(20));
                fill(pix);
            } else if (check < (centerAv*2.5)) {
                rVert = int(random(10));
                rHor = int(random(10));
                if (check > (centerAv*2)) {
                    stroke(new_col);
                    strokeWeight(0.5);
                } else {
                    noStroke();
                }
                fill(pix);
            } else if (check < (centerAv*4)) {
                //stroke(new_col);
                strokeWeight(1);
                rVert = 0;
                rHor = 0;
                coinFlip = int(random(4));
                if (coinFlip < 4) {
                    stroke(new_col);
                    fill(pix);
                } else {
                    stroke(pix);
                    fill(new_col);
                }     
            } else if (check < (centerAv*5)){
                strokeWeight(1);
                rVert = 0;
                rHor = 0;
                coinFlip = int(random(2));
                if (coinFlip == 1) {
                    stroke(new_col);
                    fill(pix);
                } else {
                    stroke(pix);
                    fill(new_col);
                }
            } else {
                strokeWeight(1);
                rVert = -3;
                rHor = -3;
                stroke(pix);
                fill(new_col);
            }

            
            rect(x, y, boxSize + rHor, boxSize + rVert);
        }
        renderCounter++;
        colorMode(RGB);
        noStroke();
    }

    
    else if (layer == 4) {
        rectMode(CENTER);
        strokeCap(SQUARE);
        for(let i=0;i<80;i++) {
            let x = floor(random(sourceImg.width));
            let y = floor(random(sourceImg.height));
            let check = dist(x, y, maskCenter[0], maskCenter[1]);
            let centerAv = (maskCenterSize[0] + maskCenterSize[0])/2;
            let rVert = 0;
            let rHor = 0;
            mask = maskImg.get(x, y);
            pix = sourceImg.get(x, y);

            
            // desat
            let col = color(pix);
            colorMode(HSB, 360, 100, 100);
            let h = hue(col);
            let b = brightness(col);
            let new_brt = map(b, 0, 100, 0, 30);
            let new_col = color(h, 0, new_brt);

            //reset
            colorMode(RGB);

            let dense = map(check, 0, 2000, 5, 30);
            let sW = map(check, 0, 2000, 2, 0.1);
            strokeWeight(sW);

            if (mask[0] > 128) {
                dense = 8;
                /*
                strokeWeight(0.5);
                rVert = int(random(-5, 2));
                rHor = int(random(5, 50));

                if (swap) {
                    stroke(255, 0, 220);
                    swap = false;
                } else {
                    stroke(0);
                    swap = true;
                }
                */
                stroke(0);
                fill(0);

            }

            else if (check < centerAv) {
                rVert = int(random(10));
                rHor = int(random(10));

                stroke(pix)
                fill(pix);
            }
            
            else if (check < (centerAv*2.5)) {
                if (swap) {
                    stroke(new_col);
                    swap = false;
                } else {
                    stroke(pix);
                    swap = true;
                }
                fill(pix);
            }

            else if (check < (centerAv*3.5)) {
                strokeWeight(sW*.6)
                stroke(new_col);
                fill(pix);
            }

            else if (check < (centerAv*4.5)) {
                strokeWeight(sW*2)
                stroke(pix);
                fill(new_col);
            }

            else {
                rVert = int(random(-5, 5));
                rHor = int(random(dense*5));
                strokeWeight(sW*1.5)
                stroke(pix);
                fill(new_col);
            }
            
            
            rect(x, y, dense + rHor, dense + rVert);
        }
        renderCounter++;
    }

    else if (layer == 5) {
        for (let i=0; i < 50; i++) {
            let x = floor(random(sourceImg.width));
            let y = floor(random(sourceImg.height));
            let check = dist(x, y, maskCenter[0], maskCenter[1]);
            let centerAv = (maskCenterSize[0] + maskCenterSize[0])/2;
            let pad = 20;
            let bL = maskCenter[0] - (maskCenterSize[0]/2);
            let bR = maskCenter[0] + (maskCenterSize[0]/2);
            let bU = maskCenter[1] - ((maskCenterSize[1] + pad)/2);
            let bD = maskCenter[1] + ((maskCenterSize[1] + pad)/2);

            let rHor = int(random(5, 50));
            let rVert = int(random(-5, 2));
            let dense = 8;
            mask = maskImg.get(x, y);
            pix = sourceImg.get(x, y);

            //check < centerAv/1.5
            if (x > bL && x < bR && y > bU && y < bD) {
                
                stroke(0);
                fill(0);
                rect(x, y, dense + rHor, dense + rVert);
                rect(x, y, dense + rVert, dense + rHor);
                
            }
        }
        renderCounter++;
    }

    else if (layer == 6) {
        noStroke();
        for(let j=renderCounter; j<renderCounter+num_lines_to_draw && j<Y_STOP; j++) {
            for(let i=0; i<X_STOP; i++) {                
                mask = maskImg.get(i, j);
                pix = sourceImg.get(i, j);

                if (mask[0] > 128) {
                    fill(pix);
                    rect(i, j, 1, 1);
                }
            }
        }
        renderCounter += num_lines_to_draw;
    }
    

    let mouseChecker = dist(mouseX, mouseY, maskCenter[0], maskCenter[1]);
    //console.log("Dist; " + mouseChecker);
    console.log(renderCounter, layer);


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
        layer = 4;
        renderCounter = 0;
    }
    else if (layer == -2 && renderCounter > 1920) {
        layer = -1;
        renderCounter = 0;
    }
    else if (layer == -3 && renderCounter > 1920) {
        layer = -1;
        renderCounter = 0;
    }
    else if (layer == 3 && renderCounter > 1000) {
        layer = 10;
        renderCounter = 0;
    }
    else if (layer == 4 && renderCounter > 700) {
        layer = 5;
        renderCounter = 0;
    }
    else if (layer == 5 && renderCounter > 500) {
        layer = 6;
        renderCounter = 0;
    }
    else if (layer == 6 && renderCounter > 1920) {
        layer = 10;
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