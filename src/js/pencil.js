import Shape from "./shape.js";

export default class Pencil {
    constructor() {
        this.shapes = []; // Lista de trazos (Shape)
        this.active_shape = null; // Trazo activo
        this.redoBtn = document.getElementById("redo-btn");
        this.eraseBtn = document.getElementById("erase-btn");

        this.setupEvents();
    }

    setupEvents() {
        // Eventos de p5.js
        window.mousePressed = () => this.startShape();
        window.mouseDragged = (event) => this.addPointToShape(event);
        window.mouseReleased = () => this.endShape();

        // Eventos personalizados
        this.redoBtn.addEventListener("click", () => this.redo());
        this.eraseBtn.addEventListener("click", () => this.erase());
    }

    startShape() {
        this.active_shape = new Shape();
        this.shapes.push(this.active_shape);
    }

    addPointToShape(event) {
        if (this.active_shape) {
            this.active_shape.addPoint(event.x, event.y);
        }
    }

    endShape() {
        if (this.active_shape) {
            this.active_shape.simplify(); // Simplifica el trazo al finalizar

            // Disparar el evento personalizado 'finishShape'
            const event = new CustomEvent("finishShape", {
                detail: { shape: this.active_shape },
            });
            window.dispatchEvent(event);

            this.active_shape = null;
        }
    }

    redo() {
        // Implementar lógica de rehacer
    }

    erase() {
        this.shapes = [];
    }

    draw() {
        this.shapes.forEach((shape) => shape.draw());
    }
}