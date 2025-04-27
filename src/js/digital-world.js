import Matter from "matter-js";
import decomp from "poly-decomp"; // Importar poly-decomp

export default class DigitalWorld {
    constructor() {
        // Configurar poly-decomp como descompositor global
        window.decomp = decomp;

        // Crear el motor y el mundo de Matter.js
        this.engine = Matter.Engine.create();
        this.world = this.engine.world;

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
        Matter.Engine.run(this.engine);
        Matter.Render.run(this.render);

        // Escuchar el evento 'finishShape' para añadir figuras al mundo físico
        this.setupEvents();
    }

    setupEvents() {
        window.addEventListener("finishShape", (event) => {
            const shape = event.detail.shape;
            if (shape) {
                this.addShape(shape.points);
            }
        });
    }

    /**
     * Añade un nuevo cuerpo al mundo físico a partir de vértices.
     * @param {Array} vertices - Lista de vértices [{x, y}, {x, y}, ...].
     */
    addShape(vertices) {
        console.log("Añadiendo forma al mundo físico:", vertices);

        // Calcular el centroide de los vértices
        const centroid = this.calculateCentroid(vertices);

        // Ajustar los vértices para que estén relativos al centroide
        const adjustedVertices = vertices.map((vertex) => ({
            x: vertex.x - centroid.x,
            y: vertex.y - centroid.y,
        }));

        // Crear el cuerpo en la posición del centroide
        const body = Matter.Bodies.fromVertices(
            centroid.x, // Posición inicial en X
            centroid.y, // Posición inicial en Y
            adjustedVertices,
            {
                isStatic: false, // El cuerpo puede moverse
                restitution: 0.5, // Elasticidad
                friction: 0.5, // Fricción
            }
        );

        if (body) {
            Matter.World.add(this.world, body); // Agregar el cuerpo al mundo
        } else {
            console.error("No se pudo crear el cuerpo a partir de los vértices.");
        }
    }

    /**
     * Calcula el centroide de un conjunto de vértices.
     * @param {Array} vertices - Lista de vértices [{x, y}, {x, y}, ...].
     * @returns {Object} - Centroide {x, y}.
     */
    calculateCentroid(vertices) {
        const sum = vertices.reduce(
            (acc, vertex) => {
                acc.x += vertex.x;
                acc.y += vertex.y;
                return acc;
            },
            { x: 0, y: 0 }
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