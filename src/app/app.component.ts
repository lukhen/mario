import { Component, OnInit } from '@angular/core';
import { images } from '../engine/images';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'mario';

    ngOnInit() {
        images.loadAll().then(() => {
            this.tick();
        }).catch(() => {
            console.log("asdfad");
        })
    }

    tick() {
        window.requestAnimationFrame(() => {
            this.tick();
        })
    }
}
