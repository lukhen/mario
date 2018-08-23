import { GameScreen } from "../engine/screen";
import { Mario } from "../figures/mario";
import { setup } from "../engine/constants";

describe("screen:", () => {
    it("rx", () => {
        let s = new GameScreen(96, 96),
            m = new Mario(0, 2);

        s.set_lx(0);
        expect(s.get_rx()).toEqual(95);
        s.set_lx(5);
        expect(s.get_rx()).toEqual(100);

    })

    it("follow", () => {
        let m = new Mario(0, 1, 32, 38),
            s = new GameScreen(3 * setup.square_size, 3 * setup.square_size);

        m.set_max_x(127);
        s.follow(m);
        expect(s.get_lx()).toEqual(0);

        m.set_lx(Math.floor(s.get_width() * setup.marioScreenOffset));
        expect(s.get_lx()).toEqual(0);

        m.set_lx(m.get_lx() + 1);
        s.follow(m);
        expect(s.get_lx()).toEqual(1);

        m.set_lx(m.get_lx() + 1);
        s.follow(m);
        expect(s.get_lx()).toEqual(2);

        m.set_lx(m.get_max_x() - Math.floor(s.get_width() * (1 - setup.marioScreenOffset)))
        s.follow(m);
        expect(m.get_lx()).toEqual(64);
        expect(s.get_rx()).toEqual(127);
        m.set_lx(m.get_lx() + 1);
        s.follow(m);
        expect(m.get_lx()).toEqual(65);
        expect(s.get_rx()).toEqual(127);

    })
})
