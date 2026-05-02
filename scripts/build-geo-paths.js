const fs = require('fs');

// ─── Projection (must match MapView.tsx exactly) ──────────────────────────
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
    let d = '';
    for (const ring of coords) {
      d += ringToPath(ring) + ' ';
    }
    paths.push(d.trim());
  }
  else if (type === 'MultiPolygon') {
    for (const polygon of coords) {
      let d = '';
      for (const ring of polygon) {
        d += ringToPath(ring) + ' ';
      }
      paths.push(d.trim());
    }
  }
  else if (type === 'LineString') {
    if (coords.length > 0) {
      const cmds = coords.map(([lon, lat], i) => {
        const [x, y] = project(lon, lat);
        return (i === 0 ? 'M' : 'L') + x + ',' + y;
      });
      paths.push(cmds.join(' '));
    }
  }
  else if (type === 'MultiLineString') {
    for (const line of coords) {
      if (line.length > 0) {
        const cmds = line.map(([lon, lat], i) => {
          const [x, y] = project(lon, lat);
          return (i === 0 ? 'M' : 'L') + x + ',' + y;
        });
        paths.push(cmds.join(' '));
      }
    }
  }

  return paths;
}

function processFeatureCollection(geojson, type) {
  const items = [];
  for (const feature of geojson.features || []) {
    const paths = geometryToPaths(feature.geometry);
    const name = feature.properties?.name || '';
    for (const d of paths) {
      if (d) items.push({ type, d, name });
    }
  }
  return items;
}

// ─── Chinese name mapping ─────────────────────────────────────────────────

const riverNameMap = {
  'Chang Jiang': '长江',
  'Yangtze': '长江',
  'Huang': '黄河',
  'Yellow': '黄河',
  'Xi': '珠江',
  'Pearl': '珠江',
  'Huai': '淮河',
  'Liao': '辽河',
  'Songhua': '松花江',
  'Amur': '黑龙江',
  'Heilong Jiang': '黑龙江',
  'Yalu': '鸭绿江',
  'Brahmaputra': '雅鲁藏布江',
  'Tarim': '塔里木河',
  'Lancang': '澜沧江',
  'Mekong': '湄公河',
  'Jialing': '嘉陵江',
  'Han': '汉江',
  'Gan': '赣江',
  'Xiang': '湘江',
  'Yuan': '沅江',
  'Dadu': '大渡河',
  'Min': '闽江',
  'Yongding': '永定河',
  'Hai': '海河',
  'Argun': '额尔古纳河',
  'Hailar': '海拉尔河',
  'Tuotuo': '沱沱河',
  'Shilka': '石勒喀河',
  'Onon': '鄂嫩河',
  'Nu': '怒江',
  'Salween': '萨尔温江',
  'Ayeyarwady': '伊洛瓦底江',
};

const lakeNameMap = {
  'Qinghai Hu': '青海湖',
  'Poyang Hu': '鄱阳湖',
  'Dongting Hu': '洞庭湖',
  'Tai Hu': '太湖',
  'Hongze Hu': '洪泽湖',
  'Hulun Nuur': '呼伦湖',
  'Nam Co': '纳木错',
  'Siling Co': '色林错',
  'Bosten Hu': '博斯腾湖',
  'Chaka Yan Hu': '茶卡盐湖',
  'Ayakkum Hu': '阿雅克库木湖',
  'Ngangla Ringeo': '昂拉仁错',
  'Tangra Yumco': '当惹雍错',
  'Yamzho Yumco': '羊卓雍错',
  'Daguan Hu': '大观湖',
  'Long Hu': '龙虎山湖',
  'Liangzi Hu': '梁子湖',
  'Po Hu': '鄱湖', // may duplicate
  'Gaoyou Hu': '高邮湖',
  'Shijiu Hu': '石臼湖',
  'Mapam Yumco': '玛旁雍错',
  'Manasarovar': '玛旁雍错',
};

function translateName(name, map) {
  for (const [en, cn] of Object.entries(map)) {
    if (name.includes(en)) return cn;
  }
  return name;
}

// ─── Build ─────────────────────────────────────────────────────────────────

const provinces = processFeatureCollection(
  JSON.parse(fs.readFileSync('data/geo/china-3pct.json', 'utf8')),
  'province'
);

const rivers = processFeatureCollection(
  JSON.parse(fs.readFileSync('data/geo/china-rivers-final.json', 'utf8')),
  'river'
).map(r => ({ ...r, name: translateName(r.name, riverNameMap) || r.name }));

const lakes = processFeatureCollection(
  JSON.parse(fs.readFileSync('data/geo/china-lakes-final.json', 'utf8')),
  'lake'
).map(l => ({ ...l, name: translateName(l.name, lakeNameMap) || l.name }));

const output = { provinces, rivers, lakes };

fs.writeFileSync('data/geo-paths.json', JSON.stringify(output, null, 2));

console.log(`Generated geo-paths.json:`);
console.log(`  Provinces: ${provinces.length}`);
console.log(`  Rivers: ${rivers.length}`);
console.log(`  Lakes: ${lakes.length}`);
console.log(`  Total size: ${(fs.statSync('data/geo-paths.json').size / 1024).toFixed(1)}KB`);
