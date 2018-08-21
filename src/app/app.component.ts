import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import { images } from '../engine/images';
import { keys } from '../engine/keys'

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'mario';

    @ViewChild("gamecanvas") canvasRef: ElementRef

    constructor(private ngZone: NgZone) {

    }

    ngOnInit() {
        let canvas: HTMLCanvasElement = this.canvasRef.nativeElement;
        canvas.tabIndex = 1;
        keys.bind(canvas);

        images.loadAll().then(() => {
            this.tick();
        })
    }


    tick() {
        window.requestAnimationFrame(() => {
            this.tick();
        })
    }
}
