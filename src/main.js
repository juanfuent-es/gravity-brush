import Pencil from "./js/pencil.js";
import DigitalWorld from "./js/digital-world.js";

const magic_pencil = new Pencil();
const world = new DigitalWorld();

window.setup = (event) => createCanvas(windowWidth, windowHeight);

// Redimensionar el canvas y el renderizador de Matter.js
window.windowResized = (event) => {
    resizeCanvas(windowWidth, windowHeight);
    world.adjustGround(); // Crear el suelo nuevamente
};

// Dibujar en cada frame
window.draw = (event) => {
    magic_pencil.draw();
    world.update(); // Actualizar el motor de Matter.js
};