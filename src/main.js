import Crayon from "./crayon.js";

const crayon = new Crayon()

window.setup = (event) => createCanvas(windowWidth, windowHeight);
// Definición de eventos en una sóla línea
window.windowResized = (event) => resizeCanvas(windowWidth, windowHeight);
// RAF: Request Animation Frame
// https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
window.draw = (event) => {
    background(255);
    crayon.draw();
};