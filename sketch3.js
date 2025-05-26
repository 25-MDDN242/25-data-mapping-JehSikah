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

let layer = 0;
let pix, mask;
let num_lines_to_draw = 40;

function draw() {
    if (layer == 0) {
        // get one scanline
        for(let j=renderCounter; j<renderCounter+num_lines_to_draw && j<Y_STOP; j++) {
            for(let i=0; i<X_STOP; i++) {
                 colorMode(RGB);
                mask = maskImg.get(i, j);
                if (mask[1] < 128) {
                    pix = sourceImg.get(i, j);
                }
                else {
                    //draw in mask
                    if(j%2 == 0 || j%3 == 0) {
                        pix = [0, 0, 0, 255]
                    }
                    else {
                        pix = sourceImg.get(i, j);
                    }
                }
                set(i, j, pix);
            }
        }
        renderCounter = renderCounter + num_lines_to_draw;
        //updatePixels();

        
    //target center
    if (maskCenter !== null) {
        strokeWeight(5);
        fill(0, 255, 0);
        stroke(255, 0, 0);
        ellipse(maskCenter[0], maskCenter[1], 100);
        line(maskCenter[0]-200, maskCenter[1], maskCenter[0]+200, maskCenter[1]);
        line(maskCenter[0], maskCenter[1]-200, maskCenter[0], maskCenter[1]+200);
        noFill();
        let mcw = maskCenterSize[0];
        let mch = maskCenterSize[1];
        rect(maskCenter[0]-mcw/2, maskCenter[1]-mch/2, mcw, mch);
    }    
    
    }
    else if (layer == 1) {
        for(let j=renderCounter; j<renderCounter+num_lines_to_draw && j<Y_STOP; j++) {
            for(let i=0; i<X_STOP; i++) {
                mask = maskImg.get(i, j);
                if (mask[0] < 128) {
                    missingTexture();
                }
            }
        }
        renderCounter = renderCounter + num_lines_to_draw;
    }



    if (layer == 0 && renderCounter <= 100000) {
        layer = 1;
        renderCounter = 0;
    }

    
}


function missingTexture() {
    let boxSize = 20;
    let gap = boxSize*2;

    fill(255, 0, 220); //missing texture purp
    for(let i = 0; i <= width; i+=gap){
        for(let j = 0; j <= height; j+=gap) {
            rect(i, j, boxSize, boxSize);
            rect(i + boxSize, j + boxSize, boxSize, boxSize);
        }
    }
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

