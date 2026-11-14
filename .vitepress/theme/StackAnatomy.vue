<script setup lang="ts">
/**
 * Fig. 1 — six years drawn as an isometric cross-section, in the style of
 * wheresryan22/anatomy (isometric solids, plate with corner labels, live readout).
 *
 *   Across (x): each role, oldest to newest   -> breadth
 *   Up     (z): the layers of the stack        -> breadth within a role
 *   Hatching   : how deep I went in that layer -> depth (1 touched, 2 shipped, 3 owned)
 *
 * Every block is the same size; depth is engraved, from single-line hatching to cross-hatch.
 *
 * The figure alternates between reading a column (one role across the stack) and a
 * row (one layer across my career). Hover a block, role or layer to inspect it.
 */
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

type Pt = [number, number];
const S = 3.2;
const C = Math.cos(Math.PI / 6);
const H = Math.sin(Math.PI / 6);
const P = (x: number, y: number, z: number): Pt => [(x - y) * C * S, (x + y) * H * S - z * S];
const poly = (pts: Pt[]) => "M" + pts.map((p) => p.map((n) => n.toFixed(1)).join(",")).join("L") + "Z";

function box(x: number, y: number, z: number, w: number, d: number, h: number) {
  const t = z + h;
  return {
    top: poly([P(x, y, t), P(x + w, y, t), P(x + w, y + d, t), P(x, y + d, t)]),
    left: poly([P(x, y + d, z), P(x + w, y + d, z), P(x + w, y + d, t), P(x, y + d, t)]),
    right: poly([P(x + w, y, z), P(x + w, y + d, z), P(x + w, y + d, t), P(x + w, y, t)]),
  };
}

// Bottom to top.
const LAYERS = ["Infra & DevOps", "Data & AI", "Backend & APIs", "Frontend", "Product & UX"];
const DEPTH_WORD = ["", "touched", "shipped", "owned"];

interface Role {
  name: string;
  years: string;
  note: string;
  depth: number[]; // per layer, bottom to top, 0–3
}
const ROLES: Role[] = [
  { name: "Appian", years: "2020–21", note: "Enterprise platform · servers, networking, deployment", depth: [3, 0, 0, 0, 0] },
  { name: "Atelier", years: "2021–22", note: "Real-time messaging · GraphQL · cloud migration", depth: [1, 0, 3, 3, 1] },
  { name: "Mirvac", years: "2022–24", note: "Mobile and web · launch site · 80% faster CI", depth: [3, 0, 1, 3, 1] },
  { name: "Sauce", years: "2024–25", note: "Analytics engine · research agent · infra-as-code", depth: [2, 3, 2, 1, 1] },
  { name: "Skip", years: "2026", note: "AI decision systems · rules engine · document AI", depth: [3, 3, 3, 3, 3] },
  { name: "Contracts", years: "2021–26", note: "Geospatial platform · mobile crypto · data viz", depth: [2, 2, 3, 2, 2] },
];

// ---- Geometry (world units) ----
// Columns march along the screen-horizontal diagonal (x up, y down by the same
// amount), so roles read left to right while depth recedes up and to the right.
const COL_W = 14;
const COL_STEP = 21;
const LAYER_H = 5;
const LAYER_STEP = 8;
const MAXD = 14; // every block has the same footprint
const origin = (i: number): [number, number] => {
  const k = i * COL_STEP + (i === ROLES.length - 1 ? 5 : 0); // contracts set slightly apart
  return [k, -k];
};
const layerZ = (l: number) => l * LAYER_STEP;

interface Cell {
  i: number;
  l: number;
  d: number;
  shape: ReturnType<typeof box> | null;
  ghost: string | null;
}
// Painter's order: left to right, bottom to top.
const cells: Cell[] = ROLES.flatMap((r, i) =>
  r.depth.map((d, l) => {
    const [x, y] = origin(i);
    const z = layerZ(l);
    return {
      i,
      l,
      d,
      shape: d ? box(x, y, z, COL_W, MAXD, LAYER_H) : null,
      ghost: d ? null : poly([P(x, y, z), P(x + COL_W, y, z), P(x + COL_W, y + MAXD, z), P(x, y + MAXD, z)]),
    };
  }),
);

// A plinth under each role.
const plinths = ROLES.map((_, i) => {
  const [x, y] = origin(i);
  return box(x - 1, y - 1, -2.5, COL_W + 2, MAXD + 2, 2.5);
});
// Legend swatch: a small cube per depth level.
const swatch = box(0, 0, 0, 5, 5, 5);
const swatchVb = (() => {
  const q = [P(0, 5, 0), P(5, 0, 0), P(0, 0, 5), P(5, 5, 0)];
  const qx = q.map((p) => p[0]);
  const qy = q.map((p) => p[1]);
  return `${Math.min(...qx) - 1} ${Math.min(...qy) - 1} ${Math.max(...qx) - Math.min(...qx) + 2} ${Math.max(...qy) - Math.min(...qy) + 2}`;
})();
const [fx, fy] = origin(0);
const layerTags = LAYERS.map((_, l) => P(fx - 3, fy + MAXD, layerZ(l) + LAYER_H / 2));
const roleTags = ROLES.map((_, i) => {
  const [x, y] = origin(i);
  const [px, py] = P(x + COL_W + 1, y + MAXD + 1, -2.5); // the plinth's nearest corner
  return [px, py + 16] as Pt;
});
const haloC = P((origin(2)[0] + origin(3)[0]) / 2 + COL_W / 2, (origin(2)[1] + origin(3)[1]) / 2 + MAXD / 2, 0);

// Bounds -> viewBox
const pts: Pt[] = [];
ROLES.forEach((_, i) => {
  const [x, y] = origin(i);
  for (const dx of [-1, COL_W + 1]) for (const dy of [-1, MAXD + 1]) for (const z of [-2.5, layerZ(4) + LAYER_H]) pts.push(P(x + dx, y + dy, z));
});
const xs = pts.map((p) => p[0]);
const ys = pts.map((p) => p[1]);
const vbX = Math.min(...xs) - 96; // room for layer labels
const vbY = Math.min(...ys) - 6;
const vb = `${vbX.toFixed(1)} ${vbY.toFixed(1)} ${(Math.max(...xs) - vbX + 60).toFixed(1)} ${(Math.max(...ys) - vbY + 34).toFixed(1)}`;

// ---- State ----
type Focus = { kind: "col"; i: number } | { kind: "row"; l: number } | { kind: "cell"; i: number; l: number };
const AUTO: Focus[] = [
  ...ROLES.map((_, i) => ({ kind: "col", i }) as Focus),
  ...LAYERS.map((_, l) => ({ kind: "row", l: LAYERS.length - 1 - l }) as Focus),
];
const step = ref(0);
const hover = ref<Focus | null>(null);
const animated = ref(false);
const focus = computed<Focus | null>(() => hover.value ?? (animated.value ? AUTO[step.value] : null));

function isLit(c: Cell) {
  const f = focus.value;
  if (!f) return false;
  if (f.kind === "col") return f.i === c.i;
  if (f.kind === "row") return f.l === c.l;
  return f.i === c.i && f.l === c.l;
}
const colLit = (i: number) => focus.value?.kind !== "row" && (focus.value as { i?: number } | null)?.i === i;
const rowLit = (l: number) => focus.value?.kind !== "col" && (focus.value as { l?: number } | null)?.l === l;

const bar = (d: number) => "■".repeat(d) + "□".repeat(3 - d);
const totalLayers = LAYERS.length;

const readout = computed(() => {
  const f = focus.value;
  if (!f) return { left: "Hover a block", right: `${ROLES.length} roles · ${totalLayers} layers` };
  if (f.kind === "col") {
    const r = ROLES[f.i];
    const n = r.depth.filter(Boolean).length;
    return { left: r.note, right: `${r.name} ${r.years} · ${n}/${totalLayers} layers` };
  }
  if (f.kind === "row") {
    const roles = ROLES.filter((r) => r.depth[f.l] > 0);
    const deepest = ROLES.filter((r) => r.depth[f.l] === 3).map((r) => r.name);
    return {
      left: deepest.length ? `Owned at ${deepest.join(", ")}` : "Touched, never owned",
      right: `${LAYERS[f.l]} · ${roles.length}/${ROLES.length} roles`,
    };
  }
  const d = ROLES[f.i].depth[f.l];
  return { left: `${bar(d)} ${d ? DEPTH_WORD[d] : "not part of the role"}`, right: `${ROLES[f.i].name} · ${LAYERS[f.l]}` };
});

let timer: ReturnType<typeof setInterval> | undefined;
onMounted(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  animated.value = true;
  timer = setInterval(() => {
    if (!hover.value) step.value = (step.value + 1) % AUTO.length;
  }, 1800);
});
onBeforeUnmount(() => timer && clearInterval(timer));
</script>

<template>
  <figure class="sa" aria-labelledby="sa-cap">
    <div class="sa-plate">
      <span class="sa-corner" data-c="fig">Fig. 1</span>
      <span class="sa-corner" data-c="title">Six years in cross-section</span>
      <span class="sa-corner" data-c="hint" aria-live="polite">{{ readout.left }}</span>
      <span class="sa-corner" data-c="readout" aria-live="polite">{{ readout.right }}</span>

      <svg
        class="sa-svg"
        :viewBox="vb"
        role="img"
        :class="{ 'sa-dim': focus }"
        aria-label="Isometric chart of six roles from 2020 to 2026. Each role is a column of up to five stacked layers, from infrastructure up to product. Hatching density shows how deep the work went: single lines touched, dense lines shipped, cross-hatch owned."
      >
        <defs>
          <pattern id="sa-h1" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect class="sa-hbg" width="6" height="6" /><line class="sa-hl" x1="0" y1="0" x2="0" y2="6" />
          </pattern>
          <pattern id="sa-h2" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect class="sa-hbg" width="3" height="3" /><line class="sa-hl" x1="0" y1="0" x2="0" y2="3" />
          </pattern>
          <pattern id="sa-h3" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect class="sa-hbg" width="3" height="3" /><line class="sa-hl" x1="0" y1="0" x2="0" y2="3" /><line class="sa-hl" x1="0" y1="0" x2="3" y2="0" />
          </pattern>
        </defs>
        <ellipse class="sa-halo" :cx="haloC[0]" :cy="haloC[1] + 10" rx="330" ry="26" />

        <g v-for="(p, i) in plinths" :key="'p' + i" class="sa-solid sa-plinth">
          <path class="sa-shade1" :d="p.left" />
          <path class="sa-shade2" :d="p.right" />
          <path class="sa-top" :d="p.top" />
        </g>

        <template v-for="c in cells" :key="c.i + '-' + c.l">
          <path v-if="c.ghost" class="sa-ghost" :d="c.ghost" :data-lit="isLit(c) ? '' : null" @mouseenter="hover = { kind: 'cell', i: c.i, l: c.l }" @mouseleave="hover = null" />
          <g
            v-else-if="c.shape"
            class="sa-solid sa-block"
            :data-lit="isLit(c) ? '' : null"
            :data-d="c.d"
            @mouseenter="hover = { kind: 'cell', i: c.i, l: c.l }"
            @mouseleave="hover = null"
          >
            <path :d="c.shape.left" :style="{ fill: `url(#sa-h${c.d})` }" />
            <path class="sa-tint1" :d="c.shape.left" />
            <path :d="c.shape.right" :style="{ fill: `url(#sa-h${c.d})` }" />
            <path class="sa-tint2" :d="c.shape.right" />
            <path :d="c.shape.top" :style="{ fill: `url(#sa-h${c.d})` }" />
          </g>
        </template>

        <text
          v-for="(t, l) in layerTags"
          :key="'l' + l"
          class="sa-tag sa-layer"
          :data-lit="rowLit(l) ? '' : null"
          :x="t[0]"
          :y="t[1]"
          tabindex="0"
          @mouseenter="hover = { kind: 'row', l }"
          @mouseleave="hover = null"
          @focus="hover = { kind: 'row', l }"
          @blur="hover = null"
        >{{ LAYERS[l] }}</text>

        <g
          v-for="(t, i) in roleTags"
          :key="'r' + i"
          class="sa-role"
          :data-lit="colLit(i) ? '' : null"
          tabindex="0"
          @mouseenter="hover = { kind: 'col', i }"
          @mouseleave="hover = null"
          @focus="hover = { kind: 'col', i }"
          @blur="hover = null"
        >
          <text class="sa-tag" :x="t[0]" :y="t[1]">{{ ROLES[i].name }}</text>
          <text class="sa-tag sa-years" :x="t[0]" :y="t[1] + 11">{{ ROLES[i].years }}</text>
        </g>
      </svg>
    </div>
    <figcaption id="sa-cap" class="sa-legend">
      <span class="sa-key"><b>Across</b> six roles, 2020 → today</span>
      <span class="sa-key"><b>Up</b> layers of the stack</span>
      <span v-for="d in [1, 2, 3]" :key="'k' + d" class="sa-key sa-swatch">
        <svg :viewBox="swatchVb" aria-hidden="true">
          <path :d="swatch.left" :style="{ fill: `url(#sa-h${d})` }" /><path class="sa-tint1" :d="swatch.left" />
          <path :d="swatch.right" :style="{ fill: `url(#sa-h${d})` }" /><path class="sa-tint2" :d="swatch.right" />
          <path :d="swatch.top" :style="{ fill: `url(#sa-h${d})` }" />
        </svg>{{ DEPTH_WORD[d] }}
      </span>
    </figcaption>
  </figure>
</template>

<style scoped>
.sa {
  --f-card: var(--r-card, #faf9f5);
  --f-top: #ffffff;
  --f-s1: #e9e7de;
  --f-s2: #dcd9cd;
  --f-lit-top: #e4ecf5;
  --f-lit-s1: #c9d6e7;
  --f-lit-s2: #b5c6dd;
  --f-line: var(--r-stone, #6b6a64);
  --f-text: var(--r-olive, #504e49);
  --f-muted: var(--r-stone, #6b6a64);
  --f-brand: var(--r-brand, #1b365d);
  --f-hatch: var(--r-brand, #1b365d);
  --f-mono: "JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace;
  margin: 8px 0 0;
}
:global(.dark) .sa {
  --f-top: #2a2a27;
  --f-s1: #20201e;
  --f-s2: #191917;
  --f-lit-top: #2b3d57;
  --f-lit-s1: #22324a;
  --f-lit-s2: #1b2a3f;
}
.sa-plate {
  position: relative;
  padding: 52px 20px;
  background: var(--f-card);
  box-shadow: 0 0 0 1px var(--r-edge, #dedbcf);
  border-radius: 8px;
}
.sa-corner {
  position: absolute;
  font-family: var(--f-mono);
  font-size: 10.5px;
  line-height: 1;
  letter-spacing: 0.06em;
  color: var(--f-muted);
  white-space: nowrap;
}
.sa-corner[data-c="fig"] { top: 20px; left: 20px; color: var(--f-text); }
.sa-corner[data-c="title"] { top: 20px; right: 20px; text-transform: uppercase; letter-spacing: 0.1em; }
.sa-corner[data-c="hint"] { bottom: 20px; left: 20px; text-transform: uppercase; letter-spacing: 0.08em; }
.sa-corner[data-c="readout"] { bottom: 20px; right: 20px; color: var(--f-text); text-transform: uppercase; font-variant-numeric: tabular-nums; }

.sa-svg { display: block; width: 100%; height: auto; overflow: visible; }
.sa-svg path { vector-effect: non-scaling-stroke; }
.sa-halo { fill: #8a8a80; opacity: 0.16; filter: blur(12px); }
.sa-solid path { stroke: var(--f-line); stroke-width: 0.6; stroke-linejoin: round; transition: fill 400ms cubic-bezier(0.32, 0.72, 0, 1), stroke 400ms; }
.sa-top { fill: var(--f-top); }
.sa-shade1 { fill: var(--f-s1); }
.sa-shade2 { fill: var(--f-s2); }
.sa-hbg { fill: var(--f-top); }
.sa-hl { stroke: var(--f-hatch); stroke-width: 0.7; }
.sa-tint1, .sa-tint2 { stroke: none !important; pointer-events: none; }
.sa-tint1 { fill: var(--f-s1); opacity: 0.45; }
.sa-tint2 { fill: var(--f-s2); opacity: 0.6; }
.sa-block { cursor: pointer; transition: opacity 400ms cubic-bezier(0.32, 0.72, 0, 1); }
.sa-dim .sa-block:not([data-lit]) { opacity: 0.32; }
.sa-block[data-lit] path { stroke: var(--f-brand); stroke-width: 1.4; }

.sa-ghost { fill: transparent; stroke: var(--f-line); stroke-width: 0.6; stroke-dasharray: 2 3; opacity: 0.55; cursor: pointer; transition: stroke 300ms, opacity 300ms; }
.sa-ghost[data-lit] { stroke: var(--f-brand); opacity: 1; }


.sa-tag {
  font-family: var(--f-mono);
  font-size: 9px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-anchor: middle;
  fill: var(--f-muted);
  transition: fill 300ms;
}
.sa-layer { text-anchor: end; dominant-baseline: middle; cursor: pointer; outline: none; }
.sa-role { cursor: pointer; outline: none; }
.sa-years { font-size: 8px; opacity: 0.75; }
.sa-layer[data-lit],
.sa-role[data-lit] .sa-tag { fill: var(--f-brand); }
.sa-layer:focus-visible,
.sa-role:focus-visible .sa-tag { text-decoration: underline; }

.sa-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 22px;
  margin-top: 12px;
  font-size: 13px;
  line-height: 1.55;
  color: var(--f-muted);
}
.sa-swatch { display: inline-flex; align-items: center; gap: 7px; }
.sa-swatch svg { width: 16px; height: 16px; flex: none; overflow: visible; }
.sa-swatch path { stroke: var(--f-line); stroke-width: 0.6; vector-effect: non-scaling-stroke; }
.sa-key b {
  font-family: var(--f-mono);
  font-size: 10.5px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--f-text);
  margin-right: 6px;
}
@media (prefers-reduced-motion: reduce) {
  .sa-solid path,
  .sa-ghost,
  .sa-block,
  .sa-tag { transition: none; }
}
@media (max-width: 560px) {
  .sa-plate { padding: 48px 8px 72px; }
  .sa-corner[data-c="hint"] { bottom: 40px; max-width: calc(100% - 40px); overflow: hidden; text-overflow: ellipsis; }
}
@media print {
  .sa { display: none; }
}
</style>
