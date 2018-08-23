import { images } from "../engine/images";
import { GameScreen } from "../engine/screen";
import { screenmatch } from "../tools/screenmath";
import { World } from "../engine/world";
import { setup } from "../engine/constants";
import { TopGrass } from "../matter/matter";

describe("Matter: ", () => {
    it("set_lx, render", (done) => {
        images.loadTopGrass().then(() => {
            let tg1 = new TopGrass(1, 1),
                s1 = new GameScreen(96, 96),
                s2 = new GameScreen(96, 96),
                empty_screen = new GameScreen(96, 96);


            s1.set_lx(0);
            expect(tg1.get_rendering_coords(s1)).toEqual([32, 32]);
            s1.set_lx(1);
            expect(tg1.get_rendering_coords(s1)).toEqual([31, 32]);
            s1.set_lx(32);
            expect(tg1.get_rendering_coords(s1)).toEqual([0, 32]);
            s1.set_lx(0);

            tg1.render(s1);

            s2.set_lx(0);
            let [x, y] = tg1.get_rendering_coords(s2);
            s2.drawImage(images.topGrass, x, y);
            expect(screenmatch(s1, empty_screen, false)).toBeFalsy();
            expect(screenmatch(s2, empty_screen, false)).toBeFalsy();
            expect(screenmatch(s1, s2, true)).toBeTruthy();

            done();

        })
    })

    it("is_on_the_scrren", () => {
        let tg = new TopGrass(0,2),
            s = new GameScreen(96, 96);

        s.set_lx(0);
        expect(tg.is_on_the_screen(s)).toBeTruthy();
        s.set_lx(31);
        expect(tg.is_on_the_screen(s)).toBeTruthy();
        s.set_lx(32);
        expect(tg.is_on_the_screen(s)).toBeFalsy();
    })

    it("get_rx", () => {
        let tg = new TopGrass(0,2);

        expect(tg.get_rx()).toEqual(31);
    })

    it("should be properly added to world.obstacles", () => {
        let tg = new TopGrass(0,0),
            w1 = new World(3, 3),
            w2 = new World(3, 3);

        tg.addToWorld(w1);
        w2.add_obstacle(tg);

        expect(w1.get_obstacle(tg.get_lx()/setup.square_size, tg.get_ty()/setup.square_size)).toBeDefined();
        expect(w2.get_obstacle(tg.get_lx()/setup.square_size, tg.get_ty()/setup.square_size)).toBeDefined();
        expect(w1.get_obstacle(tg.get_lx()/setup.square_size, tg.get_ty()/setup.square_size)).toBe(w2.get_obstacle(tg.get_lx()/setup.square_size, tg.get_ty()/setup.square_size));
        
        

        
    })
})