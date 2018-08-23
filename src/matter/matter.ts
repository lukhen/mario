import { setup, GroundBlocking } from "../engine/constants";
import { GameScreen } from "../engine/screen";
import { GameObject } from "../engine/gameobject";
import { World } from "../engine/world";
import { images } from "../engine/images";

export abstract class Matter extends GameObject{
    lx: number;
    ty: number;
    width : number;
    blocking: GroundBlocking;
    

    constructor(i, j, blocking) {
        super();
        this.lx = i * setup.square_size;
        this.ty = j * setup.square_size;
        this.width = setup.square_size;
        this.blocking = blocking;
    }


    addToWorld(world: World) {
        world.add_obstacle(this);
    }

    // !!!
    get_rendering_coords(screen: GameScreen) : [number, number]{

        if (this.is_on_the_screen(screen))
            return [this.lx - screen.get_lx(), this.ty];
        else 
            return [undefined, undefined];
    }

    // !!!
    // produce true if matter is on the screen
    is_on_the_screen(screen) {
        if (this.lx <= screen.get_rx() && this.get_rx() >= screen.get_lx()) {
            return true;
        }
        else 
            return false;

    }

    // get the most right x
    get_rx() {
        return this.lx + this.width - 1;
    }

    get_lx() {
        return this.lx;
    }

    get_ty() {
        return this.ty;
    }
}

export class TopGrass extends Matter{
    constructor(i, j) {
        let blocking = GroundBlocking.top;
        super(i, j, blocking);
    }

    get_image() {
        return images.topGrass;
    }

}

export class Stone extends Matter{
    constructor(i, j) {
        let blocking = GroundBlocking.all;
        super(i, j, blocking);
    }

    get_image() {
        return images.stone;
    }

}