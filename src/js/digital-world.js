import Matter from "matter-js";
import decomp from "poly-decomp"; // Importar poly-decomp

export default class DigitalWorld {
    constructor() {
        Matter.Common.setDecomp(decomp);
        // Crear el motor y el mundo de Matter.js
        this.engine = Matter.Engine.create();
        this.world = this.engine.world;
        this.bodies = []; // Lista de cuerpos rígidos
        this.ground = null; // Suelo del mundo físico

        // Configurar el renderizador (opcional)
        this.render = Matter.Render.create({
            element: document.body,
            engine: this.engine,
            options: {
                width: window.innerWidth,
                height: window.innerHeight,
                wireframes: true,
            },
        });

        // Iniciar el motor y el renderizador
        Matter.Runner.run(this.engine);
        Matter.Render.run(this.render);

        this.adjustGround();
        // Escuchar el evento 'finishShape' para añadir figuras al mundo físico
        this.setupEvents();
    }

    setupEvents() {
        window.addEventListener("finishShape", (event) => {
            const shape = event.detail.shape;
            console.log("Evento 'finishShape' recibido:", shape);
            if (shape) {
                this.createBody(shape.points);
            }
        });
    }

    resize() {
        this.render.options.width = window.innerWidth;
        this.render.options.height = window.innerHeight;
        this.adjustGround();
    }
    /**
     * Crea o actualiza un cuerpo rígido estático que actúa como el suelo.
     */
    adjustGround() {
        if (this.ground) {
            Matter.World.remove(this.world, this.ground);
        }
        // Crear un nuevo suelo con las dimensiones actuales del canvas
        this.ground = Matter.Bodies.rectangle(
            window.innerWidth / 2, // Posición X (centro del canvas)
            window.innerHeight, // Posición Y (parte inferior del canvas)
            window.innerWidth, // Ancho del suelo (100% del canvas)
            10, // Altura del suelo
            {
                isStatic: true, // El cuerpo no se mueve
            }
        );
        Matter.World.add(this.world, this.ground);
    }

    /**
     * Añade un nuevo cuerpo al mundo físico a partir de vértices.
     * @param {Array} vertices - Lista de vértices [{x, y}, {x, y}, ...].
     */
    createBody(vertices) {
        // Calcular el centroide de los vértices
        const centroid = this.calculateCentroid(vertices);
        let body = Matter.Bodies.fromVertices(
            centroid.x, centroid.y,
            vertices,
            {
                isStatic: false, // El cuerpo puede moverse
                restitution: 0.5, // Elasticidad
                friction: 0.5, // Fricción
            }
        );
        if (body) {
            // Agregar el cuerpo al mundo
            Matter.World.add(this.world, body);
            this.bodies.push(body); // Guardar el cuerpo para sincronizarlo con p5.js
        }
    }

    /**
     * Calcula el centroide de un conjunto de vértices.
     * @param {Array} vertices - Lista de vértices [{x, y}, {x, y}, ...].
     * @returns {Object} - Centroide {x, y}.
     */
    calculateCentroid(vertices) {
        const sum = vertices.reduce(
            (pos, vertex) => {
                pos.x += vertex.x;
                pos.y += vertex.y;
                return pos;
            }, { x: 0, y: 0 }
        );
        return {
            x: sum.x / vertices.length,
            y: sum.y / vertices.length,
        };
    }

    /**
     * Actualiza el motor físico en cada frame.
     */
    update() {
        Matter.Engine.update(this.engine);
    }
}