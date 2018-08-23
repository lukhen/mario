import { World } from "../engine/world";
import { Mario } from "../figures/mario";
import { setup } from "../engine/constants";
import { GameScreen } from "../engine/screen";
import { deepEqual, AssertionError } from "assert";
import { cloneDeep } from 'lodash'
import { areDeepEqual } from "../tools/tools";
import { Stone, TopGrass } from "../matter/matter";

describe("Movement:", () => {
    it("world should change", () => {
        let w1 = new World(5, 5);

        w1.set_mario(new Mario(1, 4, 32, 38));
        w1.set_screen(new GameScreen(96, 96));
        w1.get_screen().set_lx(0);

        let w2: World = cloneDeep(w1);
        expect(areDeepEqual(w1, w2)).toBeTruthy();


        w1.move();

        expect(areDeepEqual(w1, w2)).toBeFalsy(); //make sure world has changed

        w2.get_mario().move();
        w2.get_screen().follow(w2.get_mario());

        expect(areDeepEqual(w1, w2)).toBeTruthy();
        expect(areDeepEqual(w1.get_mario(), w2.get_mario())).toBeTruthy();
        expect(areDeepEqual(w1.get_screen(), w2.get_screen())).toBeTruthy();

    })

})

describe("Collisions", () => {
    it("resolveCollisions", () => {

        let w = new World(3, 3);
        w.set_mario(new Mario(1, 1, 32, 32));
        let w_clone = cloneDeep(w);

        w.resolveCollisions();
        w_clone.get_mario().handleCollisions(w_clone);
        expect(areDeepEqual(w, w_clone)).toBeTruthy();


    })

    it("1 - handleCollisions", () => {
        let w = new World(3, 3);
        let m = new Mario(1, 1, 32, 32);
        let tg = new TopGrass(1, 2);
        w.set_mario(m);
        w.add_obstacle(tg);


        // move mario one pixel down
        let lx_before_resolve = m.get_lx();

        m.set_lx(lx_before_resolve + 1);
        m.set_vy(1);

        let m_clone = cloneDeep(m);

        m.handleCollisions(w);
        m_clone.handleCollisionsWithObstacles(w.getObstacles());
        expect(areDeepEqual(m, m_clone)).toBeTruthy();
    })

    it("2 - handleCollisions", () => {
        let w = new World(3, 3);
        let m = new Mario(1, 1, 32, 32);
        let tg = new TopGrass(1, 2);
        w.set_mario(m);
        w.add_obstacle(tg);


        // move mario one pixel down
        let by_before_resolve = m.get_by();

        m.set_by(by_before_resolve + 1);
        m.set_vy(1);

        let m_clone = cloneDeep(m);

        m.handleCollisionsWithObstacles(w.getObstacles());

        if (m_clone.feetCollision(w.getObstacles()))
            m_clone.land();

        expect(areDeepEqual(m, m_clone)).toBeTruthy();
    })

    it("2 - feetCollision", () => {
        let m = new Mario(1, 1, 32, 32);
        m.set_vy(1);
        let tg = new TopGrass(1, 2);
        let u = undefined;
        let obstacles = [
            [u, u, u],
            [u, u, u],
            [u, tg, u]]

        expect(m.feetCollision(obstacles)).toBeFalsy();


        //m.set_by(m.get_by() + 1);
        m.move();
        expect(m.feetCollision(obstacles)).toBeTruthy();


        // move mario to the right, whwre his lox is on the left edge of tg
        m.set_lox(63);
        expect(m.feetCollision(obstacles)).toBeTruthy();

        // move mario one pixel to the right, his lox is not on tg any more, starts falling
        m.set_lox(63 + 1);
        expect(m.feetCollision(obstacles)).toBeFalsy();

        // move mario to the left, where his rox is on the right edge of tg
        m.set_rox(32);
        expect(m.feetCollision(obstacles)).toBeTruthy();

        // move mario one pixel to the left, lis rox is not on tg any more, starts falling
        m.set_rox(32 - 1);
        expect(m.feetCollision(obstacles)).toBeFalsy();

    })

    it('land', () => {
        let m = new Mario();

        m.set_vy(1);
        m.set_height(38);
        m.set_by(64);

        expect(m.land).not.toThrow(new Error('not implemented'))
        m.land();
        expect(m.get_by()).toEqual(63);
        m.land();
        expect(m.get_by()).toEqual(31);
        expect(m.get_vy()).toEqual(0);

    })

    it('mario - move()', () => {
        let m = new Mario(1, 1, 32, 38);
        m.set_vx(1);
        m.set_vy(1);
        let prev_mario = cloneDeep(m);
        m.move();

        expect(m.get_lx()).toEqual(prev_mario.get_lx() + prev_mario.get_vx())
        expect(m.get_ty()).toEqual(prev_mario.get_ty() + prev_mario.get_vy() + setup.gravity)

    })


    it("2 - headCollision", () => {
        let m = new Mario(1, 2, 32, 38);
        let s = new Stone(1, 0);
        let u = undefined;
        let obstacles = [
            [u, s, u],
            [u, u, u],
            [u, u, u]]

        expect(m.headCollision(obstacles)).toBeFalsy();
        expect(m.getObstaclesAbove(obstacles)).toEqual([]);
        expect(m.get_ty()).toBeGreaterThan(32);

        m.set_ty(32);

        expect(m.headCollision(obstacles)).toBeFalsy();
        m.set_ty(31);

        expect(m.getObstaclesAbove(obstacles)).toEqual([s]);
        expect(m.headCollision(obstacles)).toBeTruthy();


        // move mario to the right, whwre his lox is on the left edge of stone
        m.set_lox(63);
        expect(m.getObstaclesAbove(obstacles)).toEqual([s]);
        expect(m.headCollision(obstacles)).toBeTruthy();

        // // move mario one pixel to the right, his lox is not on stone any more, not colliding any more
        m.set_lox(63 + 1);
        expect(m.getObstaclesAbove(obstacles)).toEqual([]);
        expect(m.headCollision(obstacles)).toBeFalsy();

        // move mario to the left, where his rox is on the right edge of stone
        m.set_rox(32);
        expect(m.getObstaclesAbove(obstacles)).toEqual([s]);
        expect(m.headCollision(obstacles)).toBeTruthy();

        // move mario one pixel to the left, lis rox is not on stone any more, not colliding
        m.set_rox(32 - 1);
        expect(m.getObstaclesAbove(obstacles)).toEqual([]);
        expect(m.headCollision(obstacles)).toBeFalsy();

        let s2 = new Stone(0, 0);
        obstacles = [
            [s2, s, u],
            [u, u, u],
            [u, u, u]]
        m.set_rox(32);
        expect(m.getObstaclesAbove(obstacles)).toEqual([s2, s]);
    })

    it("bumpHead", () => {
        let m = new Mario(1, 1, 32, 38);
        expect(m.get_ty()).toBeLessThan(32);
        m.bumpHead();
        expect(m.get_ty()).toEqual(32);
    })


    it("2 - rightCollision", () => {
        let m = new Mario(1, 1, 32, 38);
        let s1 = new Stone(2, 1);
        let s2 = new Stone(2, 0);
        let u = undefined;
        let obstacles1 = [
            [u, u, u],
            [u, u, s1],
            [u, u, u]]
        let obstacles2 = [
            [u, u, s2],
            [u, u, u],
            [u, u, u]]
        let obstacles3 = [
            [u, u, s2],
            [u, u, s1],
            [u, u, u]]

        expect(m.rightCollision(obstacles1)).toBeFalsy();
        expect(m.getObstaclesOnTheRight(obstacles1)).toEqual([]);
        expect(m.get_rox()).toBeLessThan(64);

        m.set_rox(63);
        expect(m.get_rox()).toEqual(63);

        expect(m.rightCollision(obstacles1)).toBeFalsy();
        m.set_rox(64);

        expect(m.getObstaclesOnTheRight(obstacles1)).toEqual([s1]);
        expect(m.getObstaclesOnTheRight(obstacles2)).toEqual([s2]);
        expect(m.getObstaclesOnTheRight(obstacles3)).toEqual([s2, s1]);
        expect(m.rightCollision(obstacles1)).toBeTruthy();
        expect(m.rightCollision(obstacles2)).toBeTruthy();
        expect(m.rightCollision(obstacles3)).toBeTruthy();


        // move mario up, where his by is on the top edge of stone
        // m.set_by(32);
        // expect(m.getObstaclesOnTheRight(obstacles1)).toEqual([s1]);
        // expect(m.rightCollision(obstacles1)).toBeTruthy();

        // // move mario one pixel up, his by is one pixel above s1, not colliding any more
        // m.set_by(31);
        // expect(m.getObstaclesOnTheRight(obstacles1)).toEqual([]);
        // expect(m.rightCollision(obstacles1)).toBeFalsy();

        // // move mario down, where his ty is on the bottom edge of s1
        // m.set_ty(63);
        // expect(m.getObstaclesOnTheRight(obstacles1)).toEqual([s1]);
        // expect(m.rightCollision(obstacles1)).toBeTruthy();

        // // move mario one pixel down, lis ty is below s1, not colliding
        // m.set_ty(64);
        // expect(m.getObstaclesOnTheRight(obstacles1)).toEqual([]);
        // expect(m.rightCollision(obstacles1)).toBeFalsy();

    })

    it("should handle left collision with stone", () => {
        let m = new Mario(2, 2, 32, 38),
            s = new Stone(1, 2),
            u = undefined,
            o = [
                [u, u, u, u],
                [u, u, u, u],
                [u, s, u, u],
                [u, u, u, u]]
        expect(m.leftCollision(o)).toBeFalsy('Mario in the middle of the 2x2 square');
        expect(m.getObstaclesOnTheLeft(o)).toEqual([]);
        expect(m.get_lox()).toBeGreaterThan(64);

        m.set_lox(64);
        expect(m.get_lox()).toEqual(64);
        expect(m.getObstaclesOnTheLeft(o)).toEqual([], "obst on the left is not empty");
        expect(m.leftCollision(o)).toBeFalsy();

        m.set_lox(63);
        expect(m.get_lox()).toEqual(63);
        expect(m.getObstaclesOnTheLeft(o)).toEqual([s], "obst on the left don't equal[s]");
        expect(m.leftCollision(o)).toBeTruthy('left collision is falsy');

    })



})
