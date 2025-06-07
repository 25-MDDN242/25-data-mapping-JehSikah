let sourceFile = "test_img/input_3.jpg";
let maskFile   = "test_img/mask_3.png";
let outputFile = "output_1.png";

let mask, pix;

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
                if (mask[0] > 128) {
                    pix = color(0);
                } else {
                    pix = sourceImg.get(i, j);

                }
                set(i, j, pix);
            }
        }
        count += gap;
        updatePixels();
    }

    //uniform missing texture
    else if (layer == 1) {
        for(let j=count; j<count+gap && j<height; j+=gap) {
            for(let i=0; i<width; i+=gap) {
                mask = maskImg.get(i, j);
                let rSize = int(random(20));

                if (mask[0] > 128) {
                    missingTexture(i, j, rSize);

                }
            }
        }
        count += gap;
    }

    //random sized pixels around mask
    else if (layer == 2) {
        for(let i=0;i<5;i++) {
            let x = floor(random(sourceImg.width));
            let y = floor(random(sourceImg.height));
            mask = maskImg.get(x, y);
            let rVert = int(random(30));
            let rHor = int(random(30));
            let centerAv = (maskCenterSize[0] + maskCenterSize[0])/2;
            let check = dist(x, y, maskCenter[0], maskCenter[1]);

            if (check < centerAv && mask[0] < 128) {
                pix = sourceImg.get(x, y);
                rectMode(CENTER);
                fill(pix);
                rect(x, y, cell +rVert, cell +rHor);
            }
        }
        count++;
    }

    //random missing texture
    else if (layer == 3) {
        for(let i=0;i<5;i++) {
            let x = floor(random(sourceImg.width));
            let y = floor(random(sourceImg.height));
            mask = maskImg.get(x, y);

            let rSize = int(random(30));

            if (mask[0] > 128) {
                missingTexture(x, y, rSize);
                /*
                if (count%2 == 0) {
                    fill(0);
                } else {
                    fill(255, 0, 220);
                }
                rect(x, y, cell + rVert, cell + rHor);
                */

            }
        }
        count++;
    }



    if (layer == 0 && count >= 1920) {
        layer = 1;
        count = 0;
    }
    else if (layer == 1 && count >= 1920) {
        layer = 2;
        count = 0;
    }
    else if (layer == 2 && count >= 500) {
        layer = 4;
        count = 0;
    }
    else if (layer == 3 && count >= 500) {
        layer = 2;
        count = 0;
    }


    console.log(count);
}


let cell = 30;
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
