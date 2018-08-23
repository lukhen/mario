import { World } from "../engine/world"
import { Mario } from "../figures/mario";
import { cloneDeep } from 'lodash'
import { areDeepEqual } from "../tools/tools";
import { Direction } from "../engine/constants";
import { MarioAnimator } from "../engine/animator"

describe("Animation", () => {
    it("world.animate", () => {

        let w = new World(3, 3),
            m = new Mario(1, 1);

        // set walking and vx

        m.set_vx(1);
        m.set_walking(true);
        w.set_mario(m);
        let a = new MarioAnimator(3);
        a.set_right_frames([0, 1]);
        m.set_animator(a);


        let w_clone = cloneDeep(w);
        expect(areDeepEqual(w, w_clone)).toBeTruthy();
        w.animate();
        expect(areDeepEqual(w, w_clone)).toBeFalsy();
        w_clone.get_mario().animate();
        expect(areDeepEqual(w, w_clone)).toBeTruthy();
    })

    it("mario.animate", () => {

        let m = new Mario(1, 1);
        let a = new MarioAnimator(3);
        a.set_right_frames([0, 1]);
        m.set_animator(a);

        m.set_walking(true);
        m.set_direction(Direction.right);


        expect(m.get_sn()).toEqual(1); // default sn from constructor
        m.animate();
        expect(m.get_sn()).toEqual(0); // 2
        m.animate();
        expect(m.get_sn()).toEqual(0); // 1
        m.animate();
        expect(m.get_sn()).toEqual(0); // 0
        m.animate();
        expect(m.get_sn()).toEqual(1); // 2
        m.animate();
        expect(m.get_sn()).toEqual(1); // 1
        m.animate();
        expect(m.get_sn()).toEqual(1); // 0
        m.animate();
        m.animate();
        expect(m.get_sn()).toEqual(0); // 3
        m.animate();

    })

    it("animator", () => {
        let a = new MarioAnimator(3);
        a.set_right_frames([4, 5]);
        let m = new Mario(1, 1, 32, 38);
        m.set_walking(true);
        m.set_direction(Direction.right);

        // a.updateFrame();
        expect(a.get_walking_right_frame()).toEqual(4);
        a.updateFrame();
        expect(a.get_ticksTillNextFrame()).toEqual(2);
        expect(a.get_walking_right_frame()).toEqual(4);
        a.updateFrame();
        expect(a.get_ticksTillNextFrame()).toEqual(1);
        expect(a.get_walking_right_frame()).toEqual(4);
        a.updateFrame();
        expect(a.get_ticksTillNextFrame()).toEqual(0);
        expect(a.get_walking_right_frame()).toEqual(4);
        a.updateFrame();
        expect(a.get_ticksTillNextFrame()).toEqual(3);
        expect(a.get_walking_right_frame()).toEqual(5);
        a.updateFrame();
        expect(a.get_ticksTillNextFrame()).toEqual(2);
        expect(a.get_walking_right_frame()).toEqual(5);
        a.updateFrame();
        expect(a.get_ticksTillNextFrame()).toEqual(1);
        expect(a.get_walking_right_frame()).toEqual(5);
        a.updateFrame();
        expect(a.get_ticksTillNextFrame()).toEqual(0);
        expect(a.get_walking_right_frame()).toEqual(5);
        a.updateFrame();
        expect(a.get_ticksTillNextFrame()).toEqual(3);
        expect(a.get_walking_right_frame()).toEqual(4);
    })
})
