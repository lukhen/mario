import { World } from "./world";
import { Mario } from "../figures/mario";
import { setup } from "./constants";

export class GameScreen {
    width: number;
    height: number;
    canvas: HTMLCanvasElement;
    lx: number // world x that shows on the first left side of the screen

    constructor(width: number, height: number, canvas: HTMLCanvasElement = undefined) {
        if (canvas) {
            this.canvas = canvas;
            this.width = canvas.width;
            this.height = canvas.height;
        }
        else {
            this.canvas = document.createElement('canvas');
            this.canvas.width = width;
            this.canvas.height = height;
            this.width = width;
            this.height = height;
        }
        this.lx = 0;
    }

    get_width() {
        return this.width;
    }

    get_height() {
        return this.height;
    }

    get_canvas() {
        return this.canvas;
    }

    get_lx() {
        return this.lx;
    }

    set_lx(value) {
        this.lx = value;
    }

    // return the x coordinate of the world which is shown on the most right side
    get_rx() {
        return this.get_lx() + this.get_width() - 1;
    }

    clear() {
        this.canvas.getContext('2d').clearRect(0, 0, this.width, this.height);
    }

    // Draw image on canvas' context
    drawImage(...args) {
        if (args.length === 3)
            this.canvas.getContext('2d').drawImage(args[0], args[1], args[2]);

        else if (args.length === 9) {
            this.canvas.getContext('2d').drawImage(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8]);
        }

        else
            throw new Error('Invalid number of arguments for drawImage method')
    }


    follow(mario: Mario) {
        let new_lx = mario.get_lx() - Math.floor(setup.marioScreenOffset * this.width);
        let max_lx = mario.get_max_x() - this.width + 1;

        if (new_lx >= 0 && new_lx <= max_lx)
            this.set_lx(new_lx);
    }

}
