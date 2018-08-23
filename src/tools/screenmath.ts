import { GameScreen } from "../engine/screen";

// GameScreen GameScreen Boolean -> Boolean
// Produce true if 2 gamescreens have equal dimensions and same canvases
export function screenmatch(s1: GameScreen, s2: GameScreen, displayDiff: boolean = false) {
    return canvasmatch(s1.get_canvas(), s2.get_canvas(), displayDiff);
}


// Canvas Canvas Boolean -> Boolean
// Compare 2 canvas elements, if equal produce false, else produce true
export function canvasmatch(canvas1: HTMLCanvasElement, canvas2: HTMLCanvasElement, 
    displayDiff: boolean) {
    if ((canvas1.width != canvas2.width) || 
        (canvas1.height != canvas2.height))  
        throw new Error("Canvas elements must have equal dimensions.");

    let canvas1Copy: HTMLCanvasElement = cloneCanvas(canvas1);
    let canvas2Copy: HTMLCanvasElement = cloneCanvas(canvas2);
    let w: number = canvas1Copy.width;
    let h: number = canvas1Copy.height;
    let ctx1: CanvasRenderingContext2D = canvas1Copy.getContext('2d');
    let ctx2: CanvasRenderingContext2D = canvas2Copy.getContext('2d');
    let imagedata1: ImageData = ctx1.getImageData(0, 0, w, h);

    let imagedata2: ImageData = ctx2.getImageData(0, 0, w, h);
    
    let diffCanv: HTMLCanvasElement = null;
    let diffCtx: CanvasRenderingContext2D = null;
    let diffData: ImageData = null;
    let diffArray: Uint8ClampedArray = null;

    if (displayDiff) {
        // canvas that holds difference
        diffCanv = document.createElement('canvas');
        diffCtx = diffCanv.getContext('2d');
        diffCanv.width = w;
        diffCanv.height = h;
        diffData = diffCtx.createImageData(w, h);
        diffArray = diffData.data;
    }


    let match = pixelmatch(imagedata1.data, imagedata2.data, 
        diffArray, w, h, {threshold: 0.1})

        if (match === 0)
            return true
        else {
            if (diffData != null) {
                diffCtx.putImageData(diffData, 0, 0)
                let nw = window.open("", "", `width=${w}, height=${h}`)
                
                let div1 = nw.document.createElement("div");
                div1.style.width = `${w}`;
                div1.style.height = `${h}`;
                div1.style.border = "thin dotted red";
                div1.appendChild(canvas1Copy);

                let div2 = nw.document.createElement("div");
                div2.style.width = `${w}`;
                div2.style.height = `${h}`;
                div2.style.border = "thin dotted red";
                div2.appendChild(canvas2Copy);

                let divDiff = nw.document.createElement("div");
                divDiff.style.width = `${w}`;
                divDiff.style.height = `${h}`;
                divDiff.style.border = "thin dotted red";
                divDiff.appendChild(diffCanv);


                nw.document.body.appendChild(div1)
                nw.document.body.appendChild(div2)
                nw.document.body.appendChild(divDiff)
            }
            return false
        }
    
        
    
}

function cloneCanvas(oldCanvas) {

    //create a new canvas
    var newCanvas = document.createElement('canvas');
    var context = newCanvas.getContext('2d');

    //set dimensions
    newCanvas.width = oldCanvas.width;
    newCanvas.height = oldCanvas.height;

    //apply the old canvas to the new one
    context.drawImage(oldCanvas, 0, 0);

    //return the new canvas
    return newCanvas;
}

function pixelmatch(img1, img2, output, width, height, options) {

    if (!options) options = {};

    var threshold = options.threshold === undefined ? 0.1 : options.threshold;

    // maximum acceptable square distance between two colors;
    // 35215 is the maximum possible value for the YIQ difference metric
    var maxDelta = 35215 * threshold * threshold,
        diff = 0;

    // compare each pixel of one image against the other one
    for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {

            var pos = (y * width + x) * 4;

            // squared YUV distance between colors at this pixel position
            var delta = colorDelta(img1, img2, pos, pos);

            // the color difference is above the threshold
            if (delta > maxDelta) {
                // check it's a real rendering difference or just anti-aliasing
                if (!options.includeAA && (antialiased(img1, x, y, width, height, img2) ||
                                   antialiased(img2, x, y, width, height, img1))) {
                    // one of the pixels is anti-aliasing; draw as yellow and do not count as difference
                    if (output) drawPixel(output, pos, 255, 255, 0);

                } else {
                    // found substantial difference not caused by anti-aliasing; draw it as red
                    if (output) drawPixel(output, pos, 255, 0, 0);
                    diff++;
                }

            } else if (output) {
                // pixels are similar; draw background as grayscale image blended with white
                var val = blend(grayPixel(img1, pos), 0.1);
                drawPixel(output, pos, val, val, val);
            }
        }
    }

    // return the number of different pixels
    return diff;
}

// check if a pixel is likely a part of anti-aliasing;
// based on "Anti-aliased Pixel and Intensity Slope Detector" paper by V. Vysniauskas, 2009

function antialiased(img, x1, y1, width, height, img2=undefined) {
    var x0 = Math.max(x1 - 1, 0),
        y0 = Math.max(y1 - 1, 0),
        x2 = Math.min(x1 + 1, width - 1),
        y2 = Math.min(y1 + 1, height - 1),
        pos = (y1 * width + x1) * 4,
        zeroes = 0,
        positives = 0,
        negatives = 0,
        min = 0,
        max = 0,
        minX, minY, maxX, maxY;

    // go through 8 adjacent pixels
    for (var x = x0; x <= x2; x++) {
        for (var y = y0; y <= y2; y++) {
            if (x === x1 && y === y1) continue;

            // brightness delta between the center pixel and adjacent one
            var delta = colorDelta(img, img, pos, (y * width + x) * 4, true);

            // count the number of equal, darker and brighter adjacent pixels
            if (delta === 0) zeroes++;
            else if (delta < 0) negatives++;
            else if (delta > 0) positives++;

            // if found more than 2 equal siblings, it's definitely not anti-aliasing
            if (zeroes > 2) return false;

            if (!img2) continue;

            // remember the darkest pixel
            if (delta < min) {
                min = delta;
                minX = x;
                minY = y;
            }
            // remember the brightest pixel
            if (delta > max) {
                max = delta;
                maxX = x;
                maxY = y;
            }
        }
    }

    if (!img2) return true;

    // if there are no both darker and brighter pixels among siblings, it's not anti-aliasing
    if (negatives === 0 || positives === 0) return false;

    // if either the darkest or the brightest pixel has more than 2 equal siblings in both images
    // (definitely not anti-aliased), this pixel is anti-aliased
    return (!antialiased(img, minX, minY, width, height) && !antialiased(img2, minX, minY, width, height)) ||
           (!antialiased(img, maxX, maxY, width, height) && !antialiased(img2, maxX, maxY, width, height));
}

// calculate color difference according to the paper "Measuring perceived color difference
// using YIQ NTSC transmission color space in mobile applications" by Y. Kotsarenko and F. Ramos

function colorDelta(img1, img2, k, m, yOnly=undefined) {
    var a1 = img1[k + 3] / 255,
        a2 = img2[m + 3] / 255,

        r1 = blend(img1[k + 0], a1),
        g1 = blend(img1[k + 1], a1),
        b1 = blend(img1[k + 2], a1),

        r2 = blend(img2[m + 0], a2),
        g2 = blend(img2[m + 1], a2),
        b2 = blend(img2[m + 2], a2),

        y = rgb2y(r1, g1, b1) - rgb2y(r2, g2, b2);

    if (yOnly) return y; // brightness difference only

    var i = rgb2i(r1, g1, b1) - rgb2i(r2, g2, b2),
        q = rgb2q(r1, g1, b1) - rgb2q(r2, g2, b2);

    return 0.5053 * y * y + 0.299 * i * i + 0.1957 * q * q;
}

function rgb2y(r, g, b) { return r * 0.29889531 + g * 0.58662247 + b * 0.11448223; }
function rgb2i(r, g, b) { return r * 0.59597799 - g * 0.27417610 - b * 0.32180189; }
function rgb2q(r, g, b) { return r * 0.21147017 - g * 0.52261711 + b * 0.31114694; }

// blend semi-transparent color with white
function blend(c, a) {
    return 255 + (c - 255) * a;
}

function drawPixel(output, pos, r, g, b) {
    output[pos + 0] = r;
    output[pos + 1] = g;
    output[pos + 2] = b;
    output[pos + 3] = 255;
}

function grayPixel(img, i) {
    var a = img[i + 3] / 255,
        r = blend(img[i + 0], a),
        g = blend(img[i + 1], a),
        b = blend(img[i + 2], a);
    return rgb2y(r, g, b);
}


