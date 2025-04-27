export default class Path {
    constructor(args = {}) {
        // Estas son propiedades de la clase Line
        this.points = [];
        this.stroke = args.stroke || color(255, 0, 0);
        this.strokeWeight = args.strokeWeight || 1
    }

    addPoint(p) {
        this.points.push(p);
    }

    draw() {
        noFill();
        stroke(this.stroke);
        strokeWeight(this.strokeWeight);
        beginShape();
        this.points.forEach((p) => {
            vertex(p.x, p.y);
        });
        endShape();
    }

}