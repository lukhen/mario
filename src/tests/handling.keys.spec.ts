import { World } from "../engine/world"
import { Mario } from "../figures/mario"
import { cloneDeep } from 'lodash'
import { areDeepEqual } from "../tools/tools";
import { setup } from "../engine/constants"

describe("Handling keys:", () => {
    it("should change world when right key pressed", () => {
        let w = new World(3, 3),
            m = new Mario(1, 1, 32, 38),
            keys = { right: true }


        w.set_mario(m);
        let prev_world = cloneDeep(w);

        expect(areDeepEqual(prev_world, w)).toBeTruthy();

        w.handleKeys(keys);

        expect(areDeepEqual(prev_world, w)).toBeFalsy();

        prev_world.get_mario().handleKeys(keys);

        expect(areDeepEqual(prev_world, w)).toBeTruthy();

    })

    it("", () => {

        let m = new Mario(1, 1, 32, 38),
            keys = {
                right: true,
                left: false,
                up: false,
                down: false
            }
        m.land();

        expect(m.get_vx()).toEqual(0);
        m.handleKeys(keys);
        expect(m.get_vx()).toEqual(setup.walking_v);

        keys.right = false;
        m.handleKeys(keys);
        expect(m.get_vx()).toEqual(0);

        keys.left = true;
        m.handleKeys(keys);
        expect(m.get_vx()).toEqual(-setup.walking_v);
        expect(m.is_onground()).toBeTruthy();
        expect(m.is_walking()).toBeTruthy();

        keys.left = false;
        m.handleKeys(keys);
        expect(m.get_vx()).toEqual(0);

        keys.up = true;
        keys.left = true;

        m.handleKeys(keys);

        expect(m.get_vy()).toEqual(setup.jumping_v);
        expect(m.get_vx()).toEqual(-setup.walking_v);
        expect(m.is_onground()).toBeFalsy();
        expect(m.is_walking()).toBeFalsy();

    })
})
