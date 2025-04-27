import { simplifyPath } from "./simplify-helper.js"; // Importa la función de simplificación de caminos

export default class Shape {
    constructor() {
        this.points = []; // Lista de puntos del trazo
        this.fillColor = 'red';
    }

    addPoint(x, y) {
        this.points.push(createVector(x, y));
    }

    simplify(epsilon = 5) {
        this.points = simplifyPath(this.points, epsilon); // Simplifica los puntos
    }

    draw() {
        fill(this.fillColor);
        noStroke();

        beginShape();
        this.points.forEach((point) => vertex(point.x, point.y));
        endShape();
    }
}