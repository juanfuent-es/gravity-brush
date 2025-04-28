import { simplifyPath } from "./simplify-helper.js"; // Importa la función de simplificación de caminos

export default class Shape {
    constructor() {
        this.points = []; // Lista de puntos del trazo
        this.strokeColor = 'white';
        this.fillColor = 'red';
    }

    addPoint(x, y) {
        this.points.push(createVector(x, y));
    }

    simplify(epsilon = 5) {
        this.points = simplifyPath(this.points, epsilon); // Simplifica los puntos
    }

    draw(t) {
        fill(255);
        stroke(0);
        beginShape();
        this.points.forEach(p => vertex(p.x, p.y));
        endShape(CLOSE);
    }
}