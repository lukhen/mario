import { Direction } from "./constants"
import { Mario } from "../figures/mario"

export class MarioAnimator {

    leftFrames: number[]
    rightFrames: number[]
    currentFrameIndex: number
    ticksTillNextFrame: number
    ticksPerFrame: number

    constructor(ticksPerFrame: number) {
        this.leftFrames = [];
        this.rightFrames = [0, 1];
        this.currentFrameIndex = 0;
        this.ticksPerFrame = ticksPerFrame;
        this.ticksTillNextFrame = ticksPerFrame;
    }

    set_left_frames(leftFrames: number[]) {
        this.leftFrames = leftFrames;
    }


    set_right_frames(rightFrames: number[]) {
        this.rightFrames = rightFrames;
    }

    get_ticksTillNextFrame() { return this.ticksTillNextFrame; }


    animate(mario: Mario) {

        if (mario.is_walking()) {
            this.updateFrame();
            if (mario.get_direction() === Direction.right)
                mario.set_sn(this.get_walking_right_frame())
            else
                mario.set_sn(this.get_walking_left_frame())
        }
        else
            mario.set_sn(1);

    }

    reset() {
        this.ticksTillNextFrame = 0;
    }


    get_walking_right_frame() {
        return this.rightFrames[this.currentFrameIndex];

    }

    // !!!
    get_walking_left_frame() {
        return 0;
    }

    updateFrame() {

        if (this.ticksTillNextFrame <= 0) {
            this.ticksTillNextFrame = this.ticksPerFrame;
            if (this.currentFrameIndex >= this.rightFrames.length - 1)
                this.currentFrameIndex = 0
            else
                this.currentFrameIndex++;
        }
        else
            this.ticksTillNextFrame--;
    }

}
