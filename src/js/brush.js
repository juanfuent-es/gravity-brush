import Shape from "./shape.js";

export default class Brush {
    constructor() {
        this.shapes = []; // Lista de trazos (Shape)
        this.activeBrush = null; // Trazo activo
        this.redoBtn = document.getElementById("redo-btn");
        this.eraseBtn = document.getElementById("erase-btn");

        this.setupEvents();
    }

    setupEvents() {
        // Eventos de p5.js
        window.mousePressed = () => this.startBrush();
        window.mouseDragged = (event) => this.addPointToBrush(event);
        window.mouseReleased = () => this.finishBrush();

        // Eventos personalizados
        this.redoBtn.addEventListener("click", () => this.redo());
        this.eraseBtn.addEventListener("click", () => this.erase());
    }

    startBrush() {
        this.activeBrush = new Shape();
        this.shapes.push(this.activeBrush);
    }

    addPointToBrush(event) {
        if (this.activeBrush) {
            this.activeBrush.addPoint(event.x, event.y);
        }
    }

    finishBrush() {
        if (this.activeBrush) {
            this.activeBrush.simplify(); // Simplifica el trazo al finalizar
            this.activeBrush = null;
        }
    }

    redo() {
        // Implementar lógica de rehacer
    }

    erase() {
        this.shapes = [];
    }

    draw() {
        this.shapes.forEach((brush) => brush.draw());
    }
}