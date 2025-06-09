let sourceFile = "mince_fail/input_new3.jpg";
let maskFile   = "mince_fail/mask_new3.png";
let outputFile = "output_1.png";

let mask, pix;
let swap = true;

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

let layer = 0;
let count = 0;
let lines = 40;

function draw() {

    //draw image
    if (layer == 0) {
        for(let j=count; j<count+gap && j<height; j++) {
            for(let i=0; i<width; i++) {
                mask = maskImg.get(i, j);
                /*
                if (mask[0] < 128) {
                    pix = color(0);
                } else {
                    pix = sourceImg.get(i, j);
                }
                */
                pix = sourceImg.get(i, j);
                set(i, j, pix);
            }
        }
        count += gap;
        updatePixels();
    }

    else if (layer == 1) {
        rectMode(CENTER);
        strokeCap(SQUARE);
        for(let i=0;i<20;i++) {
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
            noStroke();
            
            if (mask[0] > 128) {
                rVert = int(random(-5, 2));
                rHor = int(random(10));

                

                if (swap) {
                    fill(255, 0, 220);
                    swap = false;
                } else {
                    fill(0);
                    swap = true;
                }

            }

            else if (check < centerAv) {
                rVert = int(random(10));
                rHor = int(random(10));

                fill(pix);
            }
            
            else if (check < (centerAv*2.5)) {
                fill(pix);
            }

            else if (check < (centerAv*3.5)) {
                strokeWeight(1);
                stroke(new_col);
                fill(pix);
            }

            else if (check < (centerAv*4.5)) {
                strokeWeight(2);
                stroke(pix);
                fill(new_col);
            }

            else {
                strokeWeight(1);
                stroke(pix);
                fill(new_col);
            }
            
            let dense = map(check, 0, 2000, 20, 5);
            rect(x, y, dense + rHor, dense + rVert);
        }
        count++;
    }

    else if (layer == 1.5) {
        for(let i=0;i<20;i++) {
            let x = floor(random(sourceImg.width));
            let y = floor(random(sourceImg.height));
            pix = sourceImg.get(x, y);
            fill(pix);
            rect(x, y, cell, cell);
        }
        count++;
    }

    else if (layer == 2) {
        rectMode(CENTER);
        strokeCap(SQUARE);
        for(let i=0;i<20;i++) {
            let x = floor(random(sourceImg.width));
            let y = floor(random(sourceImg.height));
            let check = dist(x, y, maskCenter[0], maskCenter[1]);
            let centerAv = (maskCenterSize[0] + maskCenterSize[0])/2;
            let dense;
            let stretch = 1;

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
            noStroke();
            fill(pix);
            let coinFlip = int(random(10));

            if (check > centerAv*4) {
                dense = map(check, 0, 2000, 10, 200);
                
                if (coinFlip == 1) {
                    stretch = 3;
                }
            }
            else if (check > centerAv*2.5) {
                dense = map(check, 0, 2000, 10, 150);
                if (coinFlip == 1) {
                    stretch = 2;
                }
            }
            else if (check > centerAv*1.5) {
                dense = map(check, 0, 2000, 10, 100);
            }
            else {
                dense = map(check, 0, 2000, 10, 50);
            }
            
            rect(x, y, random(dense*stretch), random(dense));
        }
        count++;
    }

    else if (layer == 3) {
        rectMode(CENTER);
        strokeCap(SQUARE);
        for(let i=0;i<20;i++) {
            let x = floor(random(sourceImg.width));
            let y = floor(random(sourceImg.height));
            let check = dist(x, y, maskCenter[0], maskCenter[1]);
            let centerAv = (maskCenterSize[0] + maskCenterSize[0])/2;
            let rVert = 0;
            let rHor = 0;
            mask = maskImg.get(x, y);
            pix = sourceImg.get(x, y);

            //reset
            colorMode(RGB);
            noStroke();
            fill(pix);

            if (mask[0] > 128) {
                //rVert = random(10);
                //rHor = random(20);
                rect(x, y, 10 + rHor, 10 + rVert);
            }
        }
        count++;
    }

    else if (layer == 4) {
        rectMode(CENTER);
        let centerAv = (maskCenterSize[0] + maskCenterSize[0]);
        fill(255, 0, 0);
        ellipse(maskCenter[0], maskCenter[1], centerAv, centerAv);
        for (let j=0; j<height; j+=cell) {
            for (let i=0; i<width; i+=cell) {
                mask = maskImg.get(i, j);
                pix = sourceImg.get(i, j);
                
                if (mask[0] > 128) {
                    fill(pix)
                    rect(i, j, cell, cell);
                }
            }
        }
        count += cell;
    }

    else if (layer == 4.5) {
        rectMode(CENTER);
        for (let j=0; j<height; j+=cell) {
            for (let i=0; i<width; i+=cell) {
                mask = maskImg.get(i, j);
                pix = sourceImg.get(i, j);
                
                if (mask[0] > 128) {
                    fill(255, 0, 0)
                    rect(i, j, cell+5, cell+5);
                }
            }
        }
        count += cell;
    }
    else if (layer == 5) {
        rectMode(CENTER);
        for (let j=0; j<100; j++) {
            let x = floor(random(sourceImg.width));
            let y = floor(random(sourceImg.height));
            mask = maskImg.get(x, y);
            pix = sourceImg.get(x, y);
                
            if (mask[0] > 128) {
                fill(pix)
                rect(x, y, cell, cell);
            }
            
        }
        count ++;
    }


    if (layer == 0 && count >= 1920) {
        layer = 1.5;
        count = 0;
    }
    else if (layer == 1 && count >= 800) {
        layer = 10;
        count = 0;
    }
    else if (layer == 1.5 && count >= 1000) {
        layer = 2;
        count = 0;
    }
    else if (layer == 2 && count >= 1000) {
        layer = 4.5;
        count = 0;
    }
    else if (layer == 3 && count >= 1500) {
        layer = 10;
        count = 0;
    }
    else if (layer == 4 && count >= 1000) {
        layer = 10;
        count = 0;
    }
    else if (layer == 4.5 && count >= 1920) {
        layer = 5;
        count = 0;
    }
    else if (layer == 5 && count >= 2000) {
        layer = 10;
        count = 0;
    }
   
    console.log(count);
}


let cell = 10;
let gap = cell*2;

function missingTexture(x, y, add) {
    let size;
    if (add === undefined) {
        size = cell
    } else {
        size = cell + add;
    }

    fill(255, 0, 220); //missing texture purp
    rect(x-size, y-size, size, size);
    rect(x, y, size, size);

    fill(0); //missing texture purp
    rect(x, y-size, size, size);
    rect(x-size, y, size, size);
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
