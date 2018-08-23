import { GameScreen } from "../engine/screen";
import { images } from "../engine/images";
import { setup, GroundBlocking, Direction } from "../engine/constants";
import { World } from "../engine/world";
import { GameObject } from "../engine/gameobject";
import { Matter } from "../matter/matter";
import { calc_row, calc_col } from "../tools/tools";
import { MarioAnimator } from "../engine/animator";

export class Mario extends GameObject {

    lx: number;  // x coordinate in pixels of the center of Mario , <0, max_x>
    ty: number;  // y coordinate in pixels of the Mario's lowest pixel (feet), <0, max_y>
    max_x: number; // the most right x coordinate of Mario, 
    max_y: number; // the lowest y coordinate of Mario
    vx: number; // horizontal speed
    vy: number; // vertical speed
    sn: number; // > 0, integer, sprite number of mario, depends on his current state
    tc: number; // <0, ticksPerFrame>, counter of ticks, when reaches 0, resets to ticksPerFrame
    width: number // >0, 
    height: number // >0
    onground: boolean;
    walking: boolean;
    direction: Direction;
    animator: MarioAnimator


    // produce mario at (i, j) square of the screen
    // mario's cx, by has to equal (i, j) cx, by
    constructor(i: number = undefined, j: number = undefined, width: number = undefined, height: number = undefined) {
        super();
        if (i !== undefined && j !== undefined && width !== undefined && height !== undefined) {
            this.width = width;
            this.height = height;
            this.lx = i * setup.square_size + Math.floor(setup.square_size / 2) - Math.floor(this.width / 2);
            this.ty = (j + 1) * setup.square_size - this.height;
        }
        this.vx = 0;
        this.vy = 0;
        this.sn = 1;
        this.set_onground(false);
        this.set_walking(false);
        this.set_animator(new MarioAnimator(5)) // defaul animator
    }

    set_animator(animator: MarioAnimator) { this.animator = animator }

    get_lx() { return this.lx; }

    // set mario's lx coordinate, but only if it's within limits
    set_lx(value) {
        this.lx = value;
    }

    // produce true if x is between 0 and max_x - mario.width
    x_within_limits(x: number) {
        //return x >=0 && x <= (this.max_x - this.width + 1)
        return true;
    }

    get_ty() { return this.ty; }

    set_ty(value) {
        this.ty = value;
    }

    get_cx() {
        return this.lx + Math.floor(this.width / 2);
    }


    get_by() {
        return this.ty + this.height - 1;
    }

    set_by(value: number) {
        this.set_ty(value - this.height + 1)
    }

    get_rx() {
        return this.lx + this.width - 1;
    }


    set_rx(value: number) {
        this.set_lx(value - this.width + 1);
    }


    get_rox() {
        return this.get_rx() - setup.overlap;
    }


    set_rox(value: number) {
        this.set_rx(value + setup.overlap)
    }


    get_lox() {
        return this.get_lx() + setup.overlap
    }


    set_lox(value: number) {
        this.set_lx(value - setup.overlap);
    }


    get_max_x() { return this.max_x }


    set_max_x(value) {
        this.max_x = value;
    }

    // !!!
    get_max_y() { return 0 }

    // !!!
    set_max_y(value) { }


    get_vx() { return this.vx }


    set_vx(value) {
        this.vx = value;
    }

    get_vy() { return this.vy }


    set_vy(value) {
        this.vy = value;
    }

    is_onground() {
        return this.onground;
    }

    set_onground(value) {
        this.onground = value;
    }

    is_walking() {
        return this.walking;
    }

    set_walking(value: boolean) {
        this.walking = value;
    }


    get_direction() { return this.direction; }
    set_direction(value) { this.direction = value; }



    // add this to the wolrd object by setting world.mario and adding to world.figures
    addToWorld(world: World) {
        world.set_mario(this);
        world.add_figure(this);
        this.set_max_x(world.get_pixelWidth() - 1)

    }


    animate() {
        this.animator.animate(this);
    }



    // return current sprite number
    get_sn() { return this.sn; }

    set_sn(value) {
        this.sn = value;
    }

    get_width() { return this.width; }


    set_width(value) {
        this.width = value;
    }

    get_height() { return this.height; }

    set_height(value) {
        this.height = value;
    }

    get_image() {
        return images.marioSprites[this.get_sn()];
    }


    get_rendering_coords(screen: GameScreen): [number, number] {
        if (this.get_lx() <= Math.floor(screen.width * setup.marioScreenOffset))
            return [this.get_lx(), this.get_ty()]
        else
            return [Math.floor(screen.width * setup.marioScreenOffset), this.get_ty()]
    }

    move() {
        this.set_lx(this.lx + this.vx);
        this.vy += setup.gravity;
        this.set_ty(this.ty + this.vy);
    }


    handleKeys(keys) {
        if (keys.right) {
            this.set_vx(setup.walking_v);
            this.direction = Direction.right;
            if (this.onground)
                this.set_walking(true);
        }
        if (keys.left) {
            this.set_vx(-setup.walking_v);
            this.direction = Direction.left;
            if (this.onground)
                this.set_walking(true);
        }

        if (!keys.right && !keys.left) {
            this.set_vx(0);
            this.set_walking(false);
        }

        if (keys.up && this.onground) {
            this.jump();
        }
    }


    jump() {

        if (this.onground)
            this.set_vy(setup.jumping_v);
        this.set_onground(false);
        this.set_walking(false);
    }

    // handle all collisions
    handleCollisions(world: World) {
        this.handleCollisionsWithObstacles(world.getObstacles())
    }

    feetCollision(obstacles: Matter[][]) {
        if (this.vy > 0) {
            for (let o of this.getObstaclesBelow(obstacles)) {
                if (o.blocking === GroundBlocking.top || o.blocking === GroundBlocking.all)
                    return true;
            }
        }
        return false;
    }


    getObstaclesBelow(obstacles: Matter[][]) {
        let obstaclesBelow = [],
            rox_col = calc_col(this.get_rox()),
            lox_col = calc_col(this.get_lox()),
            by_row = calc_row(this.get_by());

        for (let col = lox_col; col <= rox_col; col++) {
            if (obstacles[by_row][col]) {
                obstaclesBelow.push(obstacles[by_row][col]);
            }
        }
        return obstaclesBelow;
    }

    getObstaclesAbove(obstacles: Matter[][]) {
        let obstaclesAbove = [],
            rox_col = calc_col(this.get_rox()),
            lox_col = calc_col(this.get_lox()),
            ty_row = calc_row(this.get_ty());

        for (let col = lox_col; col <= rox_col; col++) {
            if (obstacles[ty_row][col]) {
                obstaclesAbove.push(obstacles[ty_row][col]);
            }
        }
        return obstaclesAbove;
    }

    getObstaclesOnTheRight(obstacles: Matter[][]) {
        let obstaclesOnTheRight = [],
            ty_row = calc_row(this.get_ty()),
            by_row = calc_row(this.get_by()),
            rox_col = calc_col(this.get_rox());

        for (let row = ty_row; row <= by_row; row++) {
            if (obstacles[row][rox_col]) {
                obstaclesOnTheRight.push(obstacles[row][rox_col]);
            }
        }
        return obstaclesOnTheRight;
    }

    getObstaclesOnTheLeft(obstacles: Matter[][]) {
        return [];
    }


    handleCollisionsWithObstacles(obstacles: Matter[][]) {
        if (this.feetCollision(obstacles))
            this.land();
        else if (this.headCollision(obstacles))
            this.bumpHead();

        if (this.rightCollision(obstacles))
            this.bumpRight();
        else if (this.leftCollision(obstacles))
            this.bumpLeft();

    }

    // move mario up so that he stands on the upper edge of the current square
    land() {
        this.vy = 0;
        this.set_by(calc_row(this.get_by()) * setup.square_size - 1);
        this.set_onground(true);
    }


    bumpHead() {
        this.vy = 0;
        this.set_ty((calc_row(this.get_ty()) + 1) * setup.square_size);
    }

    // !!!
    bumpLeft() {

    }


    bumpRight() {
        // console.log(this.get_rox(), calc_col(this.get_rox()) * setup.square_size - 1);
        this.vx = 0;
        this.set_rox(calc_col(this.get_rox()) * setup.square_size - 1)
    }



    headCollision(obstacles: Matter[][]) {
        for (let o of this.getObstaclesAbove(obstacles)) {
            if (o.blocking === GroundBlocking.bottom || o.blocking === GroundBlocking.all)
                return true;
        }
        return false;
    }


    rightCollision(obstacles: Matter[][]) {
        for (let o of this.getObstaclesOnTheRight(obstacles)) {
            if (o.blocking === GroundBlocking.left || o.blocking === GroundBlocking.all)
                return true;
        }
        return false;
    }

    // !!!
    leftCollision(obstacles: Matter[][]) {
        return false;
    }



}
