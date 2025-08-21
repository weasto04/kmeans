// K-means demo (no frameworks)
(() => {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const kSelect = document.getElementById('kSelect');
  const initBtn = document.getElementById('initCentroids');
  const assignBtn = document.getElementById('assign');
  const updateBtn = document.getElementById('update');
  const restartBtn = document.getElementById('restart');
  const iterEl = document.getElementById('iter');
  const pointCountEl = document.getElementById('pointCount');

  const W = canvas.width;
  const H = canvas.height;

  const COLORS = ['#e6194b','#3cb44b','#ffe119','#4363d8','#f58231','#911eb4'];
  const N_POINTS = 150;

  let points = [];
  let centroids = [];
  let iteration = 0;

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function makeData() {
    points = [];
    for (let i = 0; i < N_POINTS; i++) {
      points.push({ x: rand(20, W - 20), y: rand(20, H - 20), cluster: null });
    }
    iteration = 0;
    updateInfo();
    centroids = [];
    draw();
  }

  function placeCentroids(k) {
    centroids = [];
    // Place centroids randomly in the plane
    for (let i = 0; i < k; i++) {
      centroids.push({ x: rand(40, W - 40), y: rand(40, H - 40), color: COLORS[i] });
    }
    iteration = 0;
    updateInfo();
    draw();
  }

  function assignPoints() {
    if (centroids.length === 0) return;
    for (const p of points) {
      let best = null;
      let bestD = Infinity;
      for (let i = 0; i < centroids.length; i++) {
        const c = centroids[i];
        const dx = p.x - c.x;
        const dy = p.y - c.y;
        const d = dx*dx + dy*dy; // squared distance
        if (d < bestD) { bestD = d; best = i; }
      }
      p.cluster = best;
    }
    draw(true); // draw with assignment lines
  }

  function updateCentroids() {
    if (centroids.length === 0) return;
    const sums = centroids.map(() => ({ x: 0, y: 0, count: 0 }));
    for (const p of points) {
      if (p.cluster != null) {
        sums[p.cluster].x += p.x;
        sums[p.cluster].y += p.y;
        sums[p.cluster].count += 1;
      }
    }
    for (let i = 0; i < centroids.length; i++) {
      const s = sums[i];
      if (s.count > 0) {
        centroids[i].x = s.x / s.count;
        centroids[i].y = s.y / s.count;
      } else {
        // If a centroid lost all points, nudge it randomly
        centroids[i].x = rand(40, W - 40);
        centroids[i].y = rand(40, H - 40);
      }
    }
    iteration++;
    updateInfo();
    draw();
  }

  function draw(showLines = false) {
    ctx.clearRect(0,0,W,H);

    // draw lines (if requested)
    if (showLines && centroids.length > 0) {
      ctx.lineWidth = 1;
      for (const p of points) {
        if (p.cluster == null) continue;
        const c = centroids[p.cluster];
        ctx.beginPath();
        ctx.strokeStyle = c.color + '66'; // semi-transparent
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(c.x, c.y);
        ctx.stroke();
      }
    }

    // draw points
    for (const p of points) {
      ctx.beginPath();
      const r = 4;
      if (p.cluster == null) {
        ctx.fillStyle = '#222';
        ctx.globalAlpha = 0.85;
      } else {
        ctx.fillStyle = centroids[p.cluster].color;
        ctx.globalAlpha = 0.95;
      }
      ctx.arc(p.x, p.y, r, 0, Math.PI*2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    // draw centroids on top
    for (const c of centroids) {
      ctx.beginPath();
      ctx.fillStyle = c.color;
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.arc(c.x, c.y, 8, 0, Math.PI*2);
      ctx.fill();
      ctx.stroke();
    }
  }

  function updateInfo() {
    iterEl.textContent = iteration;
    pointCountEl.textContent = points.length;
  }

  // Event wiring
  initBtn.addEventListener('click', () => placeCentroids(parseInt(kSelect.value,10)));
  assignBtn.addEventListener('click', () => assignPoints());
  updateBtn.addEventListener('click', () => updateCentroids());
  restartBtn.addEventListener('click', () => makeData());

  // init
  makeData();
})();
