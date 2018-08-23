import { Mario } from "../figures/mario";
import { World } from "../engine/world";
import { GameScreen } from "../engine/screen";
import { screenmatch } from "../tools/screenmath";
import { images } from "../engine/images";
import { TopGrass } from "../matter/matter";

describe("World rendering:", () => {
    it("world.render and mario.render should produce the same", (done) => {
        images.loadMarioSprites().then(() => {
            let w = new World(7, 7);
            
            let m = new Mario();
            m.set_lx(100);
            m.set_ty(100);
            m.set_sn(0);
            
            m.addToWorld(w);

            let s1 = new GameScreen(200, 200),
                s2 = new GameScreen(200, 200),
                empty_screen = new GameScreen(200, 200);

            w.render(s1);
            m.render(s2);
            

            expect(screenmatch(s1, empty_screen)).toBeFalsy();
            expect(screenmatch(s2, empty_screen)).toBeFalsy();
            expect(screenmatch(s1, s2)).toBeTruthy();

            done();
        })
        

    })
})

describe("World rendering obstacles:", () => {
    it("", (done) => {
        images.loadMarioSprites().then(() => {
            let w = new World(3, 3);

            let tg1 = new TopGrass(1, 1);
            tg1.addToWorld(w);

            let s1 = new GameScreen(200, 200),
                s2 = new GameScreen(200, 200),
                empty_screen = new GameScreen(200, 200);

            s1.set_lx(0);
            s2.set_lx(0);
            w.render_obstacles(s1);
            tg1.render(s2);
            

            expect(screenmatch(s1, empty_screen)).toBeFalsy();
            //expect(screenmatch(s2, empty_screen)).toBeFalsy();
            //expect(screenmatch(s1, s2)).toBeTruthy();

            done();
        })
        

    })
})