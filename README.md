# K-Means Interactive Demo

This is a tiny, framework-free front-end demo that visualizes the k-means clustering algorithm.

## Files

- `index.html` — the demo UI and canvas.
- `style.css` — minimal styling.
- `script.js` — all k-means logic and drawing.

## How to run

Open `index.html` in a browser (double-click in your file explorer or use a local static server). For example, from the repo root run:

```bash
python3 -m http.server 8000
# then open http://localhost:8000 in your browser
```

## Usage

1. Pick a value of k (2–6).
2. Click "Place centroids" to randomly place k centroids (colored points).
3. Click "Assign points" to connect each data point to its closest centroid.
4. Click "Move centroids" to update centroids to the means of assigned points.
5. Repeat assign → move until clusters stabilize.
6. Click "Restart (new data)" to generate a fresh dataset.

## Notes

- This demo is intentionally minimal and uses plain JavaScript and the HTML5 canvas.
- If a centroid loses all points, it will be repositioned randomly.