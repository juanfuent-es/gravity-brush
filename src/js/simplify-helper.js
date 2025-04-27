/**
 * Simplifica un conjunto de puntos utilizando el algoritmo Ramer-Douglas-Peucker.
 * Este algoritmo reduce el número de puntos en una línea poligonal mientras conserva su forma.
 * 
 * Referencia: https://en.wikipedia.org/wiki/Ramer–Douglas–Peucker_algorithm
 *
 * @param {Array} points - Lista de puntos [{x, y}, {x, y}, ...].
 * @param {number} epsilon - Distancia mínima para conservar un punto.
 * @returns {Array} - Lista de puntos simplificados.
 */
export function simplifyPath(points, epsilon) {
    if (points.length < 3) return points; // Si hay menos de 3 puntos, no se puede simplificar

    // Encuentra el punto más alejado de la línea entre el primer y último punto
    const { maxDistance, index } = findFarthestPoint(points);

    // Si la distancia máxima es mayor que epsilon, divide y simplifica recursivamente
    if (maxDistance > epsilon) {
        const left = simplifyPath(points.slice(0, index + 1), epsilon); // Simplifica la parte izquierda
        const right = simplifyPath(points.slice(index), epsilon); // Simplifica la parte derecha
        return left.slice(0, -1).concat(right); // Combina los resultados, eliminando el punto duplicado
    } else {
        // Si no hay puntos significativos, conserva solo los extremos
        return [points[0], points[points.length - 1]];
    }
}

/**
 * Encuentra el punto más alejado de la línea entre el primer y último punto.
 *
 * @param {Array} points - Lista de puntos [{x, y}, {x, y}, ...].
 * @returns {Object} - Objeto con la distancia máxima y el índice del punto más alejado.
 */
function findFarthestPoint(points) {
    const start = points[0];
    const end = points[points.length - 1];
    let maxDistance = 0;
    let index = 0;

    for (let i = 1; i < points.length - 1; i++) {
        const distance = perpendicularDistance(points[i], start, end);
        if (distance > maxDistance) {
            maxDistance = distance;
            index = i;
        }
    }

    return { maxDistance, index };
}

/**
 * Calcula la distancia perpendicular desde un punto a una línea.
 * Fórmula basada en la geometría analítica:
 * https://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line
 *
 * @param {Object} point - Punto {x, y}.
 * @param {Object} lineStart - Punto inicial de la línea {x, y}.
 * @param {Object} lineEnd - Punto final de la línea {x, y}.
 * @returns {number} - Distancia perpendicular.
 */
function perpendicularDistance(point, lineStart, lineEnd) {
    const x0 = point.x, y0 = point.y;
    const x1 = lineStart.x, y1 = lineStart.y;
    const x2 = lineEnd.x, y2 = lineEnd.y;

    // Fórmula para la distancia de un punto a una línea
    const numerator = Math.abs((y2 - y1) * x0 - (x2 - x1) * y0 + x2 * y1 - y2 * x1);
    const denominator = Math.sqrt((y2 - y1) ** 2 + (x2 - x1) ** 2);

    return numerator / denominator;
}