import { World } from "../engine/world";
import { setup } from "../engine/constants";

describe("World:", () => {
    it("should have appropriate dimensions", () => {
        let w = new World(2, 3);

        expect(w.get_gridHeight()).toEqual(3);
        expect(w.get_gridWidth()).toEqual(2);
        expect(w.get_pixelHeight()).toEqual(3*setup.square_size);
        expect(w.get_pixelWidth()).toEqual(2*setup.square_size);
    })
})