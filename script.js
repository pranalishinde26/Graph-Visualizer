
/*CANVAS SETUP */
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Internal logical size; CSS scales it via width:100%
const W = 700, H = 480;
canvas.width = W;
canvas.height = H;

/* GRAPH DATA */
let nodes = [
    { x: 350, y: 80 },
    { x: 560, y: 200 },
    { x: 490, y: 370 },
    { x: 210, y: 370 },
    { x: 140, y: 200 }
];

let matrix = [
    [0, 4, 0, 0, 2],
    [4, 0, 3, 0, 0],
    [0, 3, 0, 5, 0],
    [0, 0, 5, 0, 6],
    [2, 0, 0, 6, 0]
];

const RADIUS = 22;

/* ANIMATION STATE — tracks which nodes are highlighted */
let highlightSet = new Set();   // currently highlighted node indices
let traversalType = null;        // 'bfs' | 'dfs' | null
let animInterval = null;
let hoveredNode = -1;

// Per-node pulse phase for idle glow
let nodePulse = nodes.map(() => Math.random() * Math.PI * 2);

/*UTILITY — convert mouse/touch event to canvas coords */
function getCanvasPos(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = W / rect.width;
    const scaleY = H / rect.height;
    const src = e.touches ? e.touches[0] : e;
    return {
        x: (src.clientX - rect.left) * scaleX,
        y: (src.clientY - rect.top) * scaleY
    };
}

/*DRAG — mouse & touch */
let dragging = null;

function onPointerDown(e) {
    const pos = getCanvasPos(e);
    nodes.forEach((n, i) => {
        if (Math.hypot(pos.x - n.x, pos.y - n.y) < RADIUS + 4) dragging = i;
    });
}
function onPointerMove(e) {
    if (dragging === null) {
        // Hover detection
        const pos = getCanvasPos(e);
        let prev = hoveredNode;
        hoveredNode = -1;
        nodes.forEach((n, i) => {
            if (Math.hypot(pos.x - n.x, pos.y - n.y) < RADIUS + 8) hoveredNode = i;
        });
        if (hoveredNode !== prev) draw();
        return;
    }
    e.preventDefault();
    const pos = getCanvasPos(e);
    nodes[dragging].x = Math.max(RADIUS, Math.min(W - RADIUS, pos.x));
    nodes[dragging].y = Math.max(RADIUS, Math.min(H - RADIUS, pos.y));
    draw();
}
function onPointerUp() { dragging = null; }

// Mouse events
canvas.addEventListener('mousedown', onPointerDown);
canvas.addEventListener('mousemove', onPointerMove);
canvas.addEventListener('mouseup', onPointerUp);
canvas.addEventListener('mouseleave', onPointerUp);

// Touch events
canvas.addEventListener('touchstart', onPointerDown, { passive: false });
canvas.addEventListener('touchmove', onPointerMove, { passive: false });
canvas.addEventListener('touchend', onPointerUp);

/* DRAW — renders the full graph each frame */
function draw() {
    ctx.clearRect(0, 0, W, H);

    // ---- DRAW EDGES ----
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            if (matrix[i][j] === 0) continue;

            const bothHighlighted = highlightSet.has(i) && highlightSet.has(j);
            const anyHighlighted = highlightSet.has(i) || highlightSet.has(j);

            // Edge line
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);

            if (bothHighlighted) {
                ctx.strokeStyle = traversalType === 'bfs' ? 'rgba(0,255,153,0.8)' : 'rgba(168,85,247,0.8)';
                ctx.lineWidth = 2.5;
                ctx.shadowColor = traversalType === 'bfs' ? '#00ff99' : '#a855f7';
                ctx.shadowBlur = 12;
            } else if (anyHighlighted) {
                ctx.strokeStyle = 'rgba(0,255,231,0.4)';
                ctx.lineWidth = 1.5;
                ctx.shadowBlur = 0;
            } else {
                ctx.strokeStyle = 'rgba(100,140,180,0.3)';
                ctx.lineWidth = 1.5;
                ctx.shadowBlur = 0;
            }
            ctx.stroke();
            ctx.shadowBlur = 0;

            // Weight label
            const mx = (nodes[i].x + nodes[j].x) / 2;
            const my = (nodes[i].y + nodes[j].y) / 2;
            ctx.font = '500 12px DM Mono, monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // Label background pill — use arc-based rounded rect for compatibility
            const lx = mx - 12, ly = my - 9, lw = 24, lh = 18, lr = 4;
            ctx.fillStyle = 'rgba(5,10,25,0.82)';
            ctx.beginPath();
            ctx.moveTo(lx + lr, ly);
            ctx.lineTo(lx + lw - lr, ly);
            ctx.arcTo(lx + lw, ly, lx + lw, ly + lr, lr);
            ctx.lineTo(lx + lw, ly + lh - lr);
            ctx.arcTo(lx + lw, ly + lh, lx + lw - lr, ly + lh, lr);
            ctx.lineTo(lx + lr, ly + lh);
            ctx.arcTo(lx, ly + lh, lx, ly + lh - lr, lr);
            ctx.lineTo(lx, ly + lr);
            ctx.arcTo(lx, ly, lx + lr, ly, lr);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = bothHighlighted ? '#ffd700' : 'rgba(255,215,0,0.55)';
            ctx.fillText(matrix[i][j], mx, my);
        }
    }

    // ---- DRAW NODES ----
    nodes.forEach((n, i) => {
        const isHighlighted = highlightSet.has(i);
        const isHovered = hoveredNode === i;

        // Outer glow ring — use explicit rgba strings (hex colors break createRadialGradient)
        if (isHighlighted || isHovered) {
            const glowRGBA = isHighlighted
                ? (traversalType === 'bfs' ? 'rgba(0,255,153,0.45)' : 'rgba(168,85,247,0.45)')
                : 'rgba(0,255,231,0.35)';
            const gRadius = isHovered ? RADIUS + 12 : RADIUS + 8;

            const grad = ctx.createRadialGradient(n.x, n.y, RADIUS - 2, n.x, n.y, gRadius + 8);
            grad.addColorStop(0, glowRGBA);
            grad.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(n.x, n.y, gRadius + 8, 0, Math.PI * 2);
            ctx.fill();
        }

        // Node fill
        const fillColor = isHighlighted
            ? (traversalType === 'bfs' ? '#004d26' : '#2e1065')
            : (isHovered ? '#0d2a4a' : '#080d20');

        ctx.beginPath();
        ctx.arc(n.x, n.y, RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = fillColor;
        ctx.fill();

        // Node border
        const borderColor = isHighlighted
            ? (traversalType === 'bfs' ? '#00ff99' : '#a855f7')
            : (isHovered ? '#00ffe7' : 'rgba(0,255,231,0.4)');
        const borderWidth = isHighlighted ? 2.5 : (isHovered ? 2 : 1);

        ctx.strokeStyle = borderColor;
        ctx.lineWidth = borderWidth;
        ctx.shadowColor = borderColor;
        ctx.shadowBlur = isHighlighted ? 18 : (isHovered ? 10 : 4);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Node label
        ctx.font = '500 13px DM Sans, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = isHighlighted ? '#fff' : (isHovered ? '#00ffe7' : 'rgba(200,230,240,0.8)');
        ctx.fillText(i, n.x, n.y);
    });
}

/* ANIMATE */
function animate(order, type) {
    // Cancel any running animation
    if (animInterval) clearInterval(animInterval);
    highlightSet.clear();
    traversalType = type;
    draw();

    let step = 0;

    animInterval = setInterval(() => {
        if (step < order.length) {
            highlightSet.add(order[step]);
            setStatus(`// ${type.toUpperCase()} — visiting node ${order[step]} (step ${step + 1}/${order.length})`);
            renderMatrix();
            draw();
            step++;
        } else {
            clearInterval(animInterval);
            animInterval = null;
            setStatus(`// ${type.toUpperCase()} complete — visited: [${order.join(' → ')}]`);
        }
    }, 700);
}

//BFS
function startBFS() {
    const visited = new Array(nodes.length).fill(false);
    const queue = [0];
    const order = [];
    visited[0] = true;

    while (queue.length) {
        const v = queue.shift();
        order.push(v);
        for (let i = 0; i < nodes.length; i++) {
            if (matrix[v][i] !== 0 && !visited[i]) {
                visited[i] = true;
                queue.push(i);
            }
        }
    }
    animate(order, 'bfs');
}

//DFS
function startDFS() {
    const visited = new Array(nodes.length).fill(false);
    const order = [];

    function dfs(v) {
        visited[v] = true;
        order.push(v);
        for (let i = 0; i < nodes.length; i++) {
            if (matrix[v][i] !== 0 && !visited[i]) dfs(i);
        }
    }

    dfs(0);
    animate(order, 'dfs');
}

/*
   EDGE CONTROLS — add, remove
   Valid node indices: 0 to nodes.length - 1
   Weight must be a positive integer
*/
function addEdge() {
    const u = parseInt(document.getElementById('eu').value, 10);
    const v = parseInt(document.getElementById('ev').value, 10);
    const w = parseInt(document.getElementById('ew').value, 10);
    const n = nodes.length;

    if (isNaN(u) || isNaN(v) || isNaN(w)) {
        return setStatus('// ERROR: all fields must be numbers');
    }
    if (u < 0 || v < 0 || u >= n || v >= n) {
        return setStatus(`// ERROR: node indices must be 0 – ${n - 1}`);
    }
    if (u === v) {
        return setStatus('// ERROR: self-loops not supported');
    }
    if (w < 1) {
        return setStatus('// ERROR: weight must be ≥ 1');
    }

    matrix[u][v] = w;
    matrix[v][u] = w;
    setStatus(`// EDGE ADDED: ${u} ↔ ${v}  [weight ${w}]`);
    renderMatrix();
    draw();
}

function removeEdge() {
    const u = parseInt(document.getElementById('eu').value, 10);
    const v = parseInt(document.getElementById('ev').value, 10);
    const n = nodes.length;

    if (isNaN(u) || isNaN(v)) {
        return setStatus('// ERROR: enter valid node indices');
    }
    if (u < 0 || v < 0 || u >= n || v >= n) {
        return setStatus(`// ERROR: node indices must be 0 – ${n - 1}`);
    }
    if (matrix[u][v] === 0) {
        return setStatus(`// WARNING: no edge exists between ${u} and ${v}`);
    }

    matrix[u][v] = 0;
    matrix[v][u] = 0;
    setStatus(`// EDGE REMOVED: ${u} ↔ ${v}`);
    renderMatrix();
    draw();
}

/* 
   RESET GRAPH — restore default layout
*/
function resetGraph() {
    if (animInterval) { clearInterval(animInterval); animInterval = null; }
    highlightSet.clear();
    traversalType = null;

    nodes = [
        { x: 350, y: 80 },
        { x: 560, y: 200 },
        { x: 490, y: 370 },
        { x: 210, y: 370 },
        { x: 140, y: 200 }
    ];

    matrix = [
        [0, 4, 0, 0, 2],
        [4, 0, 3, 0, 0],
        [0, 3, 0, 5, 0],
        [0, 0, 5, 0, 6],
        [2, 0, 0, 6, 0]
    ];

    setStatus('// GRAPH RESET — default topology restored');
    renderMatrix();
    draw();
}

/* 
   STATUS BAR
 */
function setStatus(msg) {
    const el = document.getElementById('status');
    el.textContent = msg;
}

/* 
   ADJACENCY MATRIX RENDERER
   - Shows weight values; 0 = no edge
   - Highlights cells where BOTH row and col nodes are visited
   - Diagonal shown as "–" (no self-loops)
 */
function renderMatrix() {
    const table = document.getElementById('matrixTable');
    const n = nodes.length;
    let html = '<tr><th>·</th>';

    for (let j = 0; j < n; j++) {
        const hdr = highlightSet.has(j) ? 'highlight' : '';
        html += `<th class="${hdr}">${j}</th>`;
    }
    html += '</tr>';

    for (let i = 0; i < n; i++) {
        const rowHL = highlightSet.has(i) ? 'highlight' : '';
        html += `<tr><th class="${rowHL}">${i}</th>`;
        for (let j = 0; j < n; j++) {
            if (i === j) {
                html += `<td style="color:rgba(200,230,240,0.2)">–</td>`;
                continue;
            }
            const val = matrix[i][j];
            let cls = '';
            if (highlightSet.has(i) && highlightSet.has(j) && val !== 0) {
                cls = 'highlight';
            } else if (val !== 0) {
                cls = 'nonzero';
            }
            html += `<td class="${cls}">${val}</td>`;
        }
        html += '</tr>';
    }

    table.innerHTML = html;
}

/* 
   AMBIENT PULSE ANIMATION — gentle idle node breathing
*/
function pulse() {
    nodePulse = nodePulse.map(p => p + 0.025);
    // Only redraw idle (no traversal running) to avoid fighting the animation
    if (!animInterval) draw();
    requestAnimationFrame(pulse);
}

/* 
   INIT
 */
renderMatrix();
draw();
requestAnimationFrame(pulse);
