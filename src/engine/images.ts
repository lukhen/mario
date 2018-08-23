import { imageFiles } from "./constants";

export var images = {

    loadMarioSprites: () => {
        return new Promise((resolve, reject) => {
            let image = new Image();
            image.onload = () => {
                Promise.all([
                    createImageBitmap(image, 23, 39, 31, 40),  // 38 to 40
                    createImageBitmap(image, 103, 40, 31, 40), // 29 to 31
                    createImageBitmap(image, 182, 52, 31, 28),
                    createImageBitmap(image, 268, 52, 31, 28),
                    createImageBitmap(image, 346, 42, 29, 40),
                    createImageBitmap(image, 426, 42, 29, 40),
                    createImageBitmap(image, 506, 42, 29, 40),
                    createImageBitmap(image, 586, 42, 29, 40),
                    createImageBitmap(image, 26, 121, 31, 40), // 29 to 31 and 28 to 26
                    createImageBitmap(image, 106, 120, 31, 40), // 38 to 40
                    createImageBitmap(image, 186, 105, 33, 56),
                    createImageBitmap(image, 267, 119, 33, 42),
                    createImageBitmap(image, 346, 118, 31, 28),
                    createImageBitmap(image, 424, 112, 33, 40),
                    createImageBitmap(image, 504, 110, 33, 44),
                    createImageBitmap(image, 584, 110, 33, 44),
                    createImageBitmap(image, 26, 186, 31, 56),
                    createImageBitmap(image, 104, 184, 33, 54),
                    createImageBitmap(image, 184, 186, 33, 56),
                    createImageBitmap(image, 264, 212, 33, 30),
                    createImageBitmap(image, 344, 184, 33, 56),
                    createImageBitmap(image, 424, 184, 33, 56),
                    createImageBitmap(image, 506, 184, 31, 56),
                    createImageBitmap(image, 584, 184, 31, 56),
                    createImageBitmap(image, 24, 265, 33, 54),
                    createImageBitmap(image, 104, 267, 31, 56),
                    createImageBitmap(image, 184, 267, 33, 56),
                    createImageBitmap(image, 265, 293, 33, 30),
                    createImageBitmap(image, 424, 262, 33, 58),
                    createImageBitmap(image, 504, 260, 33, 62),
                    createImageBitmap(image, 584, 260, 33, 62),
                    createImageBitmap(image, 24, 352, 33, 48),
                    createImageBitmap(image, 104, 352, 33, 48),
                    createImageBitmap(image, 191, 366, 17, 16),
                    createImageBitmap(image, 273, 359, 23, 32),
                    createImageBitmap(image, 342, 344, 37, 56),
                    createImageBitmap(image, 422, 344, 37, 54),
                    createImageBitmap(image, 502, 344, 37, 56),
                    createImageBitmap(image, 582, 344, 37, 56),
                    createImageBitmap(image, 4, 433, 33, 30),
                    createImageBitmap(image, 44, 433, 31, 30),
                    createImageBitmap(image, 85, 433, 33, 30),
                    createImageBitmap(image, 125, 433, 33, 30),
                    createImageBitmap(image, 164, 433, 33, 30),
                    createImageBitmap(image, 205, 433, 31, 30),
                    createImageBitmap(image, 344, 424, 33, 56),
                    createImageBitmap(image, 426, 424, 31, 54),
                    createImageBitmap(image, 504, 426, 33, 50),
                    createImageBitmap(image, 584, 426, 33, 50)
                ]).then((sprites) => {
                    images.marioSprites = sprites;
                    resolve();
                })
                
            }
            image.onerror = () => {
                reject('Error on loading Mario sprites');
            }

            image.src = imageFiles.sprites;
            
        })
        
    },

    loadTopGrass() : Promise<undefined>{
            return this.loadSingleImage(imageFiles.objects, 888, 404, 32, 32, (img) => {this.topGrass = img;})
    },

    loadStone() {
        return this.loadSingleImage(imageFiles.objects, 550, 160, 32, 32, (img) => {this.stone = img;})
    },


    loadAll() {
        return Promise.all([
                this.loadMarioSprites(),
                this.loadTopGrass(),
                this.loadStone()
        ])
    },

    loadSingleImage(imgSrc, x, y, width, height, load) {
        return new Promise((resolve, reject) => {
            let img = new Image();
            img.onload = () => {
                createImageBitmap(img, x, y, width, height).then((btm) => {
                    load(btm);
                    resolve();
                })
            }

            img.src = imgSrc;
        })
    },

    marioSprites: undefined,
    topGrass: undefined,
    stone: undefined
}