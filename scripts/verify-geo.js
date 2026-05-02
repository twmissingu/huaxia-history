const fs = require('fs');

// ─── Copy of existing projection ───────────────────────────────────────────
const VIEWBOX_W = 1200;
const VIEWBOX_H = 850;
const MIN_LON = 80;
const MAX_LON = 135;
const MIN_LAT = 17;
const MAX_LAT = 55;

function project(lon, lat) {
  const x = ((lon - MIN_LON) / (MAX_LON - MIN_LON)) * VIEWBOX_W;
  const y = ((MAX_LAT - lat) / (MAX_LAT - MIN_LAT)) * VIEWBOX_H;
  return [Math.round(x * 10) / 10, Math.round(y * 10) / 10];
}

// ─── GeoJSON → SVG path ───────────────────────────────────────────────────

function ringToPath(ring) {
  if (!ring || ring.length === 0) return '';
  const cmds = ring.map(([lon, lat], i) => {
    const [x, y] = project(lon, lat);
    return (i === 0 ? 'M' : 'L') + x + ',' + y;
  });
  return cmds.join(' ') + ' Z';
}

function geometryToPaths(geometry) {
  const paths = [];
  if (!geometry) return paths;

  const type = geometry.type;
  const coords = geometry.coordinates;

  if (type === 'Polygon') {
    // coords: [outerRing, hole1, hole2, ...]
    let d = '';
    for (const ring of coords) {
      d += ringToPath(ring) + ' ';
    }
    paths.push({ d: d.trim(), fillRule: 'evenodd' });
  }
  else if (type === 'MultiPolygon') {
    // coords: [Polygon, Polygon, ...]
    for (const polygon of coords) {
      let d = '';
      for (const ring of polygon) {
        d += ringToPath(ring) + ' ';
      }
      paths.push({ d: d.trim(), fillRule: 'evenodd' });
    }
  }
  else if (type === 'LineString') {
    if (coords.length > 0) {
      const cmds = coords.map(([lon, lat], i) => {
        const [x, y] = project(lon, lat);
        return (i === 0 ? 'M' : 'L') + x + ',' + y;
      });
      paths.push({ d: cmds.join(' ') });
    }
  }
  else if (type === 'MultiLineString') {
    for (const line of coords) {
      if (line.length > 0) {
        const cmds = line.map(([lon, lat], i) => {
          const [x, y] = project(lon, lat);
          return (i === 0 ? 'M' : 'L') + x + ',' + y;
        });
        paths.push({ d: cmds.join(' ') });
      }
    }
  }

  return paths;
}

function featureCollectionToPaths(geojson) {
  const paths = [];
  for (const feature of geojson.features || []) {
    const geomPaths = geometryToPaths(feature.geometry);
    for (const p of geomPaths) {
      paths.push({
        ...p,
        name: feature.properties?.name || '',
      });
    }
  }
  return paths;
}

// ─── Generate test HTML ───────────────────────────────────────────────────

function generateTestHtml(paths, title) {
  const pathEls = paths.map((p, i) => {
    const isLine = !p.fillRule;
    return `<path d="${p.d}" fill="${isLine ? 'none' : '#d4c4a8'}" stroke="${isLine ? '#4682b4' : '#8b7355'}" stroke-width="${isLine ? '1' : '1.2'}" opacity="${isLine ? '0.5' : '0.3'}" ${p.fillRule ? `fill-rule="${p.fillRule}"` : ''} />`;
  }).join('\n    ');

  // Add some known city markers for alignment check
  const cities = [
    { name: '北京', lon: 116.4, lat: 39.9 },
    { name: '长安(西安)', lon: 108.9, lat: 34.3 },
    { name: '洛阳', lon: 112.4, lat: 34.6 },
    { name: '南京', lon: 118.8, lat: 32.1 },
    { name: '杭州', lon: 120.2, lat: 30.3 },
    { name: '成都', lon: 104.1, lat: 30.7 },
    { name: '广州', lon: 113.3, lat: 23.1 },
    { name: '拉萨', lon: 91.1, lat: 29.7 },
    { name: '乌鲁木齐', lon: 87.6, lat: 43.8 },
    { name: '哈尔滨', lon: 126.6, lat: 45.8 },
  ];

  const cityEls = cities.map(c => {
    const [x, y] = project(c.lon, c.lat);
    return `<circle cx="${x}" cy="${y}" r="4" fill="#c9372c" opacity="0.7" /><text x="${x+6}" y="${y+4}" font-size="10" fill="#c9372c" font-family="sans-serif">${c.name}</text>`;
  }).join('\n    ');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>body { margin: 0; background: #f5f0e8; display: flex; justify-content: center; align-items: center; min-height: 100vh; }</style>
</head>
<body>
  <svg viewBox="0 0 ${VIEWBOX_W} ${VIEWBOX_H}" width="1200" height="850" style="background: #f5f0e8; border: 1px solid #ddd;">
    ${pathEls}
    ${cityEls}
  </svg>
</body>
</html>`;
}

// ─── Run ──────────────────────────────────────────────────────────────────

['china-5pct', 'china-3pct', 'china-1.5pct'].forEach(name => {
  const geojson = JSON.parse(fs.readFileSync(`data/geo/${name}.json`, 'utf8'));
  const paths = featureCollectionToPaths(geojson);
  console.log(`${name}: ${paths.length} path(s)`);
  const html = generateTestHtml(paths, `${name} verification`);
  fs.writeFileSync(`tmp/verify-${name}.html`, html);
});

console.log('Test HTML files generated in tmp/');
