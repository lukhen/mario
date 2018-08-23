import { Mario } from "../figures/mario";
import { areDeepEqual } from "../tools/tools";
describe("", () => {
    it("", () => {
        let m1 = new Mario(1, 1, 10, 10),
            m2 = new Mario(1, 1, 10, 10);


        expect(areDeepEqual(m1, m2, true)).toBeTruthy();

    })
})
