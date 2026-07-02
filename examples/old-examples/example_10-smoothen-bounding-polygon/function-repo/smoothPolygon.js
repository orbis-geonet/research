export function smoothPolygon(polygon, windowSize = 10, weight = 0.2, iterations = 10) {
    let smoothedPolygon = polygon.slice(); // Make a copy of the original polygon

    for (let iter = 0; iter < iterations; iter++) {
        const tempPolygon = smoothedPolygon.slice(); // Make a copy of the current smoothed polygon

        for (let i = 0; i < polygon.length; i++) {
            let sumX = 0;
            let sumY = 0;
            let totalWeight = 0;

            let newWindowSize = windowSize / (iter + 1);
            for (let j = i - Math.floor(newWindowSize / 2); j <= i + Math.floor(newWindowSize / 2); j++) {
                if (j >= 0 && j < polygon.length) {
                    const dist = Math.abs(i - j);
                    const w = Math.pow(weight, dist);
                    sumX += tempPolygon[j].x * w;
                    sumY += tempPolygon[j].y * w;
                    totalWeight += w;
                }
            }

            const smoothedX = sumX / totalWeight;
            const smoothedY = sumY / totalWeight;

            smoothedPolygon[i] = { x: smoothedX, y: smoothedY };
        }
    }

    return smoothedPolygon;
}
