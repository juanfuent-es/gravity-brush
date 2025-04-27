
import Path from "./path.js";
export default class Crayon {
    constructor() {
        this.paths = [] // array of lines
        this.current_path = null
        // buttons
        this.redoBtn = document.getElementById('redo-btn');
        this.eraseBtn = document.getElementById('erase-btn');
        //
        this.events()
    }

    events() {
        // p5 events
        window.mousePressed = (event) => this.addLine(event);
        window.mouseDragged = (event) => this.addPoint(event);
        // custom events
        this.redoBtn.addEventListener('click', () => this.redo());
        this.eraseBtn.addEventListener('click', () => this.erase());
    }

    redo() {
        // redo stuff
    }
    // reset lines
    erase() {
        this.paths = []
    }

    addLine() {
        this.current_path = new Path({
            stroke: color(random(255), random(255), random(255)),
            strokeWeight: random(1, 10),
        });
        this.paths.push(this.current_path);
    }

    addPoint(event) {
        const point = createVector(event.x, event.y);
        this.current_path.addPoint(point);
    }

    draw() {
        this.paths.forEach(line => line.draw());
    }
}