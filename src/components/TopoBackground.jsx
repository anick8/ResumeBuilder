/**
 * Builds one smooth closed contour as an SVG path around (cx, cy).
 * Radius varies with angle so rings look organic rather than circular.
 */
function ring(cx, cy, r, seed) {
  const steps = 48;
  const pts = [];
  for (let i = 0; i < steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    const wobble =
      1 +
      0.14 * Math.sin(3 * a + seed) +
      0.08 * Math.sin(5 * a - seed * 1.7) +
      0.05 * Math.sin(8 * a + seed * 0.6);
    pts.push([cx + Math.cos(a) * r * wobble, cy + Math.sin(a) * r * wobble]);
  }
  // Catmull-Rom → cubic Bézier for a smooth closed curve.
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < steps; i++) {
    const p0 = pts[(i - 1 + steps) % steps];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % steps];
    const p3 = pts[(i + 2) % steps];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d + "Z";
}

/** Concentric contour rings centred on (cx, cy). */
function Contours({ cx, cy, count, start, step, seed }) {
  return Array.from({ length: count }, (_, i) => (
    <path key={i} d={ring(cx, cy, start + i * step, seed + i * 0.35)} />
  ));
}

/**
 * Decorative topographic contour lines for the Modern template — one cluster
 * in the top-right corner and one in the bottom-left, like the source PDF.
 * Purely visual; sits behind content and is skipped by screen readers.
 */
export function TopoBackground() {
  return (
    <svg
      className="topo"
      viewBox="0 0 794 1123"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" stroke="#111827" strokeWidth="0.8" strokeOpacity="0.07">
        <Contours cx={790} cy={40} count={14} start={60} step={38} seed={1.3} />
        <Contours
          cx={10}
          cy={1110}
          count={12}
          start={50}
          step={42}
          seed={4.1}
        />
      </g>
    </svg>
  );
}
