import Pencil from "./js/pencil.js";
import DigitalWorld from "./js/digital-world.js";

const magic_crayon = new Pencil();
const world = new DigitalWorld();

window.setup = (event) => createCanvas(windowWidth, windowHeight);

// Redimensionar el canvas y el renderizador de Matter.js
window.windowResized = (event) => {
    resizeCanvas(windowWidth, windowHeight);
    world.resize(); // Crear el suelo nuevamente
};

// Dibujar en cada frame
window.draw = (event) => {
    background(255); // Limpiar el canvas
    world.update(); // Actualizar el motor de Matter.js
    magic_crayon.draw(world.bodies); // Dibujar los trazos
};