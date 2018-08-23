import { GameScreen } from "./screen";
import { Mario } from "../figures/mario";
import { Matter } from "../matter/matter";
import { setup } from "./constants";

export class World {

    // constants
    gridWidth: number;
    gridHeight: number;
    pixelWidth: number;
    pixelHeight: number;
    landscape_image_number;
    obstacles: Matter[][];
    figures;

    // changing
    mario: Mario;
    screen: GameScreen;


    constructor(gridWidth: number, gridHeight: number) {
        this.set_gridWidth(gridWidth);
        this.set_gridHeight(gridHeight);

        this.figures = [];
        this.obstacles = [];

        // create empty grid representation of obstacles
        for (var i = 0; i < this.gridWidth; i++) {
            var t: Matter[] = [];

            for (var j = 0; j < this.gridHeight; j++)
                t.push(undefined);

            this.obstacles.push(t);
        }

    }


    get_gridWidth() { return this.gridWidth; }


    set_gridWidth(value) {
        this.gridWidth = value;
        this.pixelWidth = value * setup.square_size;
    }


    get_gridHeight() { return this.gridHeight }


    set_gridHeight(value) {
        this.gridHeight = value;
        this.pixelHeight = value * setup.square_size;
    }


    get_pixelHeight() { return this.pixelHeight; }
    get_pixelWidth() { return this.pixelWidth; }


    // !!!
    get_landscape() { return 0 }

    // !!!
    set_landscape(value) {

    }

    // insert obstacle into apropriate grid square
    add_obstacle(obstacle: Matter) {
        let i = Math.floor(obstacle.get_lx() / setup.square_size),
            j = Math.floor(obstacle.get_ty() / setup.square_size);
        this.obstacles[j][i] = obstacle;
    }

    get_obstacle(i: number, j: number) {
        return this.obstacles[j][i];
    }

    getObstacles() {
        return this.obstacles;
    }

    add_figure(f) {
        this.figures.push(f);
    }


    get_mario() { return this.mario; }


    set_mario(value) {
        this.mario = value;
    }

    get_screen() { return this.screen; }


    set_screen(value) {
        this.screen = value;
    }


    // make mario react on key strokes
    handleKeys(keys) {
        this.mario.handleKeys(keys);
    }


    // move all objects and screen
    move() {

        this.mario.move();
        this.screen.follow(this.mario);
    }


    animate() {
        this.mario.animate();
    }


    // render all objects on the screen
    render(screen: GameScreen) {
        this.render_figures(screen);
        this.render_obstacles(screen);
    }

    // render all obstacles
    render_obstacles(screen) {
        for (let col of this.obstacles) {
            for (let o of col) {
                if (o)
                    o.render(screen);
            }
        }
    }

    render_figures(screen: GameScreen) {
        for (let f of this.figures) {
            f.render(screen);
        }
    }


    resolveCollisions() {
        this.mario.handleCollisions(this);
    }



}
