import { images } from "../engine/images";

describe('images', () => {
    it('should be defined after having been load', (done) => {
        images.marioSprites = undefined;
        expect(images.marioSprites).not.toBeDefined();
        
        images.loadAll().then(() => {
            expect(images.marioSprites).toBeDefined();
            expect(images.marioSprites.length).toEqual(49);
            expect(images.topGrass).toBeDefined();
            expect(images.stone).toBeDefined();
            done();
        })
        
    })
})