import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import { images } from '../engine/images';
import { keys } from '../engine/keys'
import { GameScreen } from '../engine/screen';
import { World } from '../engine/world';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'mario';
    screen;
    world;

    @ViewChild("gamecanvas") canvasRef: ElementRef

    constructor(private ngZone: NgZone) {

    }

    ngOnInit() {
        let canvas: HTMLCanvasElement = this.canvasRef.nativeElement;
        canvas.tabIndex = 1;
        keys.bind(canvas);
        this.screen = new GameScreen(canvas.width, canvas.height, canvas);
        this.world = new World(252, 15);
        images.loadAll().then(() => {
            this.tick();
        })
    }


    tick() {
        window.requestAnimationFrame(() => {
            this.tick();
            this.screen.clear();
            this.world.handleKeys(keys);
            this.world.move();
            this.world.animate();
            this.world.resolveCollisions();
            this.screen.follow(this.world.get_mario());
            this.world.render(this.screen);
            this.tick();
        })
    }
}
