let sourceFile = "mince_fail/input_new3.jpg";
let maskFile   = "mince_fail/mask_new3.png";
let outputFile = "output_6.png";

let count = 0;
let layer = 0;
let pix, mask;
let lineLoad = 40;
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

function draw() {
    //draw desaturated image and black mask
    if (layer == 0) {
        for(let j=count; j<count+lineLoad && j<Y_STOP; j++) {
            for(let i=0; i<X_STOP; i++) {                
                colorMode(RGB);
                pix = sourceImg.get(i, j);
                mask = maskImg.get(i, j);
                // create a color from the values (always RGB)
                let col = color(pix);
                //let maskData = maskImg.get(i, j);
                
                colorMode(HSB, 360, 100, 100);
                // draw a "dimmed" version in gray
                let h = hue(col);
                let b = brightness(col);
                
                let new_brt = map(b, 0, 100, 0, 30);
                let new_col = color(h, 0, new_brt);

                if (mask[0] >128) {
                    set(i, j, 0);
                } else {
                    set(i, j, new_col);
                }

                colorMode(RGB);
            }
        }
        count += lineLoad;
        updatePixels();
    } 

    //draw random pixels
    //closer to mask middle, smaller pixels coloured in image colour
    //further away from center, larger desaturated pixels with image colour strokes to "fade out", also become wide rectangles to mimic glitching and less clarity
    else if (layer == 1) {
        rectMode(CENTER);
        strokeCap(SQUARE);
        for(let i=0;i<50;i++) {
            let x = floor(random(sourceImg.width));
            let y = floor(random(sourceImg.height));
            let check = dist(x, y, maskCenter[0], maskCenter[1]);
            let centerAv = (maskCenterSize[0] + maskCenterSize[0])/2;
            let rVert = 0;
            let rHor = 0;
            mask = maskImg.get(x, y);
            pix = sourceImg.get(x, y);
            
            //get desaturated colour
            let col = color(pix);
            colorMode(HSB, 360, 100, 100);
            let h = hue(col);
            let b = brightness(col);
            let new_brt = map(b, 0, 100, 0, 30);
            let new_col = color(h, 0, new_brt);

            //reset
            colorMode(RGB);

            //get bigger the further out from mask
            let dense = map(check, 0, 2000, 5, 50);
            let sW = map(check, 0, 2000, 2, 0.1);
            strokeWeight(sW);

            //less saturated further out fom mask
            if (mask[0] > 128) {
                dense = 8;
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
                rVert = int(random(5));
                rHor = int(random(5));
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
                rVert = int(random(8));
                rHor = int(random(8));
                strokeWeight(sW*.6)
                stroke(new_col);
                fill(pix);
            }

            else if (check < (centerAv*4.5)) {
                rVert = int(random(10));
                rHor = int(random(10));
                strokeWeight(sW*2)
                stroke(pix);
                fill(new_col);
            }

            else {
                rVert = int(random(-5, 20));
                rHor = int(random(dense*5));
                strokeWeight(sW*1.5)
                stroke(pix);
                fill(new_col);
            }
            
            
            rect(x, y, dense + rHor, dense + rVert);
        }
        count++;
    }

    //+highlight behind steve
    else if (layer == 2) {
        noStroke();
        for (let i=0; i < 50; i++) {
            let x = floor(random(sourceImg.width));
            let y = floor(random(sourceImg.height));
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

            if (x > bL && x < bR && y > bU && y < bD) {
                fill(0, 0, 0, 150);
                rect(x, y, dense + rHor, dense + rVert);
                rect(x, y, dense + rVert, dense + rHor);
            }
        }
        count++;
    }

    //draw steve clear
    else if (layer == 3) {
        for(let j=count; j<count+lineLoad && j<Y_STOP; j++) {
            for(let i=0; i<X_STOP; i++) {                
                mask = maskImg.get(i, j);
                pix = sourceImg.get(i, j);

                if (mask[0] > 128) {
                    fill(pix);
                    rect(i, j, 1, 1);
                }
            }
        }
        count += lineLoad;
    }

    else if (layer == 10) {
        console.log("Done!")
        noLoop();
        // uncomment this to save the result
        // saveArtworkImage(outputFile);
    }
    

    let mouseChecker = dist(mouseX, mouseY, maskCenter[0], maskCenter[1]);
    //console.log("Dist; " + mouseChecker);
    console.log(count, layer);


    
    if (layer == 0 && count > 1920) {
        layer = 1;
        count = 0;
    }
    else if (layer == 1 && count > 700) {
        layer = 2;
        count = 0;
    }
    else if (layer == 2 && count > 500) {
        layer = 3;
        count = 0;
    }
    else if (layer == 3 && count > 1920) {
        layer = 10;
        count = 0;
    }
}

// PHOEBES BLOB CODE
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