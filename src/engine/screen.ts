export class GameScreen {
    width: number;
    height: number;
    canvas: HTMLCanvasElement;
    lx: number // leftside x coordinate

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

    // !!!
    clear() { }

    // !!!
    follow(world) { }

}
