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
            if (shape) return this.createBody(shape.points);
        });
    }

    resize() {
        this.render.options.width = window.innerWidth;
        this.render.options.height = window.innerHeight;
        this.adjustGround();
    }

    /* Crea o actualiza un cuerpo rígido estático que actúa como el suelo. */
    adjustGround() {
        if (!this.ground) {
            this.ground = Matter.Bodies.rectangle(1, 1, 1, 1, { isStatic: true });
            Matter.World.add(this.world, this.ground);
        }
        Matter.Body.setPosition(this.ground, {
            x: window.innerWidth / 2,
            y: window.innerHeight,
        });
        Matter.Body.setVertices(this.ground, [
            { x: 0, y: 0 },
            { x: window.innerWidth, y: 0 },
            { x: window.innerWidth, y: 10 },
            { x: 0, y: 10 },
        ]);
    }

    /**
     * Añade un nuevo cuerpo al mundo físico a partir de vértices.
     * @param {Array} vertices - Lista de vértices [{x, y}, {x, y}, ...].
     */
    createBody(vertices) {
        console.log("Añadiendo forma al mundo físico:", vertices);
        // Calcular el centroide de los vértices
        const centroid = this.calculateCentroid(vertices);
        // Calcular el área del cuerpo
        const area = this.calculatePolygonArea(vertices);
        // Ajustar propiedades físicas según el área
        const density = 2 * area; // Densidad proporcional al área
        const restitution = Math.max(0.1, 1 - area / 10000); // Menor restitución para áreas grandes
        const friction = Math.min(1, 0.1 + area / 5000); // Mayor fricción para áreas grandes

        // Crear el cuerpo en la posición del centroide
        let body = Matter.Bodies.fromVertices(
            centroid.x, // Posición inicial en X
            centroid.y, // Posición inicial en Y
            vertices,
            {
                density: density, // Densidad proporcional al área
                restitution: restitution, // Elasticidad ajustada
                friction: friction, // Fricción ajustada
            }
        );

        if (body) {
            console.log("Propiedades físicas asignadas:", {
                density,
                restitution,
                friction,
            });

            // Agregar el cuerpo al mundo
            Matter.World.add(this.world, body);
            this.bodies.push(body); // Guardar el cuerpo para sincronizarlo con p5.js
        }
    }

     /**
     * Calcula el área de un polígono dado sus vértices.
     * @param {Array} vertices - Lista de vértices [{x, y}, {x, y}, ...].
     * @returns {number} - Área del polígono.
     */
     calculatePolygonArea(vertices) {
        let area = 0;
        const n = vertices.length;

        for (let i = 0; i < n; i++) {
            const current = vertices[i];
            const next = vertices[(i + 1) % n]; // El siguiente vértice (circular)
            area += current.x * next.y - next.x * current.y;
        }

        return Math.abs(area / 2); // Retornar el área absoluta
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