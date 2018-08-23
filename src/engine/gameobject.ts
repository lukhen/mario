import { GameScreen } from "./screen";
import { World } from "./world";

export abstract class GameObject {
    abstract get_image(): ImageBitmap;
    abstract get_rendering_coords(screen: GameScreen): [number, number];
    abstract addToWorld(world: World);
    render(screen: GameScreen) {
        let [x, y] = this.get_rendering_coords(screen);
        if (x !== undefined)
            screen.drawImage(this.get_image(), x, y);
    }
}