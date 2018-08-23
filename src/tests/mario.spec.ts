import { Mario } from "../figures/mario";
import { GameScreen } from "../engine/screen";
import { screenmatch } from "../tools/screenmath";
import { images } from "../engine/images";
import { setup } from "../engine/constants";
import { World } from "../engine/world";
import { TopGrass } from "../matter/matter";
import { areDeepEqual } from "../tools/tools";
import { cloneDeep } from 'lodash'

describe("Mario rendering:", () => {
    it("should render marios sprite at right coordinates", (done) => {
        images.loadMarioSprites().then(() => {
            let m = new Mario();
            m.set_lx(100);
            m.set_ty(100);
            m.set_sn(0);


            let s1 = new GameScreen(200, 200),
                s2 = new GameScreen(200, 200),
                empty_screen = new GameScreen(200, 200),
                [x, y] = m.get_rendering_coords(s2);

            m.render(s1);

            s2.drawImage(images.marioSprites[m.get_sn()], x, y);


            expect(screenmatch(s1, s2, true)).toBeTruthy();
            expect(screenmatch(s1, empty_screen)).toBeFalsy();
            expect(screenmatch(s2, empty_screen)).toBeFalsy();

            done();

        })



    })
})

describe("Mario rendering coordinates:", () => {
    it("should return appropriate coordinates of the screen", () => {
        let m = new Mario(),
            s = new GameScreen(200, 200);

        m.set_lx(10);
        m.set_ty(10);

        let [x, y] = m.get_rendering_coords(s);
        expect(x).toEqual(10);
        expect(y).toEqual(10);

        m.set_lx(m.get_lx() + 1);
        [x, y] = m.get_rendering_coords(s);
        expect(x).toEqual(11);


        let screenOffset = Math.floor(setup.marioScreenOffset * s.width);
        m.set_lx(screenOffset);
        [x, y] = m.get_rendering_coords(s);
        expect(x).toEqual(screenOffset);

        m.set_lx(screenOffset + 1);
        [x, y] = m.get_rendering_coords(s);
        expect(x).toEqual(screenOffset);


    })
})

describe("Mario constructor:", () => {
    it("1: should create mario at apropriate position", () => {
        let m = new Mario(0, 0, 32, 32);
        expect(m.get_cx()).toEqual(Math.floor(setup.square_size / 2));
        expect(m.get_by()).toEqual(31);

    })

    it("2: should create mario at apropriate position", () => {
        let m = new Mario(1, 1, 31, 38);
        expect(m.get_cx()).toEqual(48);
        expect(m.get_by()).toEqual(63);
        expect(m.get_ty()).toEqual(26);
        expect(m.get_rx()).toEqual(63);
        expect(m.get_lx()).toEqual(33);

    })
})

describe("Mario cx, rx, by:", () => {
    it("should ", () => {
        let m = new Mario();
        m.set_lx(0);
        m.set_ty(0);
        m.set_height(5);
        m.set_width(5);

        expect(m.get_cx()).toEqual(2);
        expect(m.get_by()).toEqual(4);
        expect(m.get_rx()).toEqual(4);

    })

    it("lox, rox", () => {
        let m = new Mario();
        m.set_lx(0);
        m.set_ty(0);
        m.set_height(32);
        m.set_width(32);

        expect(m.get_cx()).toEqual(16);
        expect(m.get_lox()).toEqual(0 + setup.overlap);
        expect(m.get_rox()).toEqual(m.get_rx() - setup.overlap);

        m.set_lox(10);
        expect(m.get_lx()).toEqual(10 - setup.overlap)
        expect(m.get_rox()).toEqual(m.get_rx() - setup.overlap);

        m.set_rox(32);
        expect(m.get_lx()).toEqual(8);

    })

    it("by, ty", () => {
        let m = new Mario();
        m.set_lx(0);
        m.set_ty(0);
        m.set_height(32);
        m.set_width(32);

        expect(m.get_by()).toEqual(31);
        m.set_by(34);
        expect(m.get_ty()).toEqual(3);


    })
})

describe("Mario addToWorld:", () => {
    it("should add mario to the world figures and set mario field", () => {
        let m = new Mario(1, 1, 31, 38),
            w = new World(3, 3);

        m.addToWorld(w);

        expect(w.mario).toEqual(m);
        expect(w.figures).toContain(m);




    })
})

describe("Mario getObstaclesBelow:", () => {
    it("should contain tg1 and/or tg2", () => {
        let m = new Mario(1, 1, 31, 38),
            tg1 = new TopGrass(0, 2),
            tg2 = new TopGrass(1, 2),
            u = undefined,
            obstacles = [
                [u, u, u],
                [u, u, u],
                [tg1, tg2, u]
            ]

        let obsBelow = m.getObstaclesBelow(obstacles);
        expect(obsBelow.length).toEqual(0);

        // move mario one pixel down
        m.set_by(m.get_by() + 1);
        obsBelow = m.getObstaclesBelow(obstacles);
        expect(obsBelow.length).toEqual(1);
        expect(obsBelow).toContain(tg2);

        // move mario to the left where his lox is on the edge of of tg2

        m.set_lox(32);
        obsBelow = m.getObstaclesBelow(obstacles);
        expect(obsBelow.length).toEqual(1);
        expect(obsBelow).toContain(tg2);

        // move mario one pixel left where his lox has entered tg1, now he stands on tg1 and tg2
        m.set_lox(32 - 1);
        obsBelow = m.getObstaclesBelow(obstacles);
        expect(obsBelow.length).toEqual(2);
        expect(obsBelow).toContain(tg2);
        expect(obsBelow).toContain(tg1);

        // move mario to the left where his rox equals 32, mario still stands on tg1 and tg2
        m.set_rox(32);
        obsBelow = m.getObstaclesBelow(obstacles);
        expect(obsBelow.length).toEqual(2);
        expect(obsBelow).toContain(tg2);
        expect(obsBelow).toContain(tg1);

        // move mario one pixel left, mario stands on tg1 only
        m.set_rox(32 - 1);
        obsBelow = m.getObstaclesBelow(obstacles);
        expect(obsBelow.length).toEqual(1);
        expect(obsBelow).toContain(tg1);




    })
})

describe("jump", () => {
    it("", () => {

        let m = new Mario(1, 1, 32, 38),
            prev_m = cloneDeep(m);
        m.jump();

        expect(areDeepEqual(prev_m, m)).toBeTruthy(); // mario is still in the air, can't jump

        m.land();
        m.jump();
        expect(m.get_vy()).toEqual(setup.jumping_v);
        expect(m.is_onground()).toBeFalsy();
    })
})

