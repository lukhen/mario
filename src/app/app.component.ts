import { Component, NgZone, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GameScreen } from '../engine/screen';
import { World } from '../engine/world';
import { keys } from '../engine/keys';
import { images } from '../engine/images';
import { Mario } from '../figures/mario';
import { TopGrass, Stone } from '../matter/matter';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'angular-mario';
    screen: GameScreen;
    world: World;


    @ViewChild("gamecanvas") canvasRef: ElementRef

    constructor(private ngZone: NgZone) {

    }

    ngOnInit() {
        let canvas: HTMLCanvasElement = this.canvasRef.nativeElement;
        canvas.tabIndex = 1;
        keys.bind(canvas);
        this.screen = new GameScreen(canvas.width, canvas.height, canvas);
        this.world = new World(252, 15);
        this.world.set_screen(this.screen);
        let objects = [
            new Mario(1, 1, 31, 38),
            new TopGrass(1, 10),
            new TopGrass(2, 10),
            new TopGrass(3, 10),
            new TopGrass(4, 10),
            new TopGrass(5, 10),
            new TopGrass(6, 10),
            new TopGrass(7, 10),
            new TopGrass(8, 10),
            new TopGrass(9, 10),
            new TopGrass(10, 10),
            new Stone(3, 9),
            new Stone(10, 9)
        ];
        this.load_world(this.world, objects);
        images.loadAll().then(() => {
            this.tick()
        });

    }

    tick() {
        window.requestAnimationFrame(() => {
            this.screen.clear();
            this.world.handleKeys(keys);
            this.world.move();
            this.world.animate();
            this.world.resolveCollisions();
            this.world.screen.follow(this.world.get_mario());
            this.world.render(this.screen);
            this.tick();
        })
    }


    load_world(world, objects) {
        for (let o of objects) {
            if (o)
                o.addToWorld(world);
        }
    }
}
