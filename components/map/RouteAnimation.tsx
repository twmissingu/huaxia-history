'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { project } from './MapView';
import { MapPin } from 'lucide-react';

interface Waypoint {
  name: string;
  coordinates: [number, number];
  description: string;
}

interface RouteData {
  id: string;
  name: string;
  color: string;
  glowColor: string;
  icon: 'caravan' | 'ship' | 'fortress';
  coordinates: [number, number][];
  waypoints: Waypoint[];
}

const ROUTES: Record<string, RouteData> = {
  'silk-road': {
    id: 'silk-road',
    name: '丝绸之路',
    color: '#d4af37',
    glowColor: '#f0e68c',
    icon: 'caravan',
    coordinates: [
      [108.94, 34.34],
      [103.8, 36.1],
      [102.6, 37.9],
      [94.7, 40.1],
      [89.2, 42.9],
      [80.0, 39.5],
    ],
    waypoints: [
      { name: '长安', coordinates: [108.94, 34.34], description: '丝绸之路起点，汉唐盛世之都' },
      { name: '兰州', coordinates: [103.8, 36.1], description: '河西走廊东大门' },
      { name: '武威', coordinates: [102.6, 37.9], description: '河西四郡之一，丝路重镇' },
      { name: '敦煌', coordinates: [94.7, 40.1], description: '莫高窟与艺术宝库' },
      { name: '吐鲁番', coordinates: [89.2, 42.9], description: '西域交通枢纽' },
      { name: '喀什', coordinates: [80.0, 39.5], description: '丝路西陲重镇' },
    ],
  },
  'grand-canal': {
    id: 'grand-canal',
    name: '京杭大运河',
    color: '#4682b4',
    glowColor: '#87ceeb',
    icon: 'ship',
    coordinates: [
      [116.41, 39.9],
      [117.2, 39.1],
      [116.4, 37.4],
      [119.0, 33.5],
      [119.4, 32.4],
      [120.16, 30.25],
    ],
    waypoints: [
      { name: '北京', coordinates: [116.41, 39.9], description: '运河最北端，元明清都城' },
      { name: '天津', coordinates: [117.2, 39.1], description: '漕运咽喉，海上门户' },
      { name: '德州', coordinates: [116.4, 37.4], description: '南北漕运中转站' },
      { name: '淮安', coordinates: [119.0, 33.5], description: '运河枢纽，漕运总督驻地' },
      { name: '扬州', coordinates: [119.4, 32.4], description: '烟花三月，淮左名都' },
      { name: '杭州', coordinates: [120.16, 30.25], description: '运河最南端，南宋都城' },
    ],
  },
  'great-wall': {
    id: 'great-wall',
    name: '万里长城',
    color: '#6b5b4f',
    glowColor: '#a89b8e',
    icon: 'fortress',
    coordinates: [
      [119.75, 40.0],
      [117.1, 40.7],
      [116.0, 40.4],
      [113.3, 40.1],
      [109.7, 38.3],
      [98.2, 39.8],
    ],
    waypoints: [
      { name: '山海关', coordinates: [119.75, 40.0], description: '天下第一关，长城东起点' },
      { name: '古北口', coordinates: [117.1, 40.7], description: '京师咽喉，兵家必争' },
      { name: '居庸关', coordinates: [116.0, 40.4], description: '太行八陉，京北锁钥' },
      { name: '大同', coordinates: [113.3, 40.1], description: '九边重镇，北魏平城' },
      { name: '榆林', coordinates: [109.7, 38.3], description: '延绥镇，塞上明珠' },
      { name: '嘉峪关', coordinates: [98.2, 39.8], description: '天下第一雄关，长城西终点' },
    ],
  },
  'zhenghe-voyage': {
    id: 'zhenghe-voyage',
    name: '郑和下西洋',
    color: '#1a5276',
    glowColor: '#5dade2',
    icon: 'ship',
    coordinates: [
      [118.8, 32.1],
      [121.1, 31.5],
      [118.7, 24.9],
      [113.3, 23.1],
      [112.0, 17.5],
    ],
    waypoints: [
      { name: '南京', coordinates: [118.8, 32.1], description: '宝船厂所在地，航海起点' },
      { name: '太仓·刘家港', coordinates: [121.1, 31.5], description: '起锚地，七下西洋始发港' },
      { name: '泉州', coordinates: [118.7, 24.9], description: '东方第一大港，海上丝路起点' },
      { name: '广州', coordinates: [113.3, 23.1], description: '南海门户，对外贸易港' },
      { name: '西沙群岛', coordinates: [112.0, 17.5], description: '航线继续延伸至马六甲、印度洋、东非' },
    ],
  },
  'xuanzang-journey': {
    id: 'xuanzang-journey',
    name: '玄奘西行',
    color: '#b35a1f',
    glowColor: '#e8a87c',
    icon: 'caravan',
    coordinates: [
      [108.94, 34.34],
      [105.7, 34.6],
      [103.8, 36.1],
      [94.7, 40.1],
      [89.2, 42.9],
      [82.9, 41.7],
    ],
    waypoints: [
      { name: '长安', coordinates: [108.94, 34.34], description: '玄奘西行起点，大唐国都' },
      { name: '秦州', coordinates: [105.7, 34.6], description: '今甘肃天水，西行首站' },
      { name: '兰州', coordinates: [103.8, 36.1], description: '黄河古渡，丝路咽喉' },
      { name: '敦煌', coordinates: [94.7, 40.1], description: '西行必经，千佛洞前' },
      { name: '高昌', coordinates: [89.2, 42.9], description: '今吐鲁番，玄奘讲经一月' },
      { name: '龟兹', coordinates: [82.9, 41.7], description: '今新疆库车，佛教东传重镇' },
    ],
  },
};

interface RouteAnimationProps {
  routeId: string;
}

export function RouteAnimation({ routeId }: RouteAnimationProps) {
  const route = ROUTES[routeId];
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    waypoint: Waypoint;
  } | null>(null);

  const pathD = useMemo(() => {
    if (!route) return '';
    const points = route.coordinates.map((c) => project(c[0], c[1]));
    return `M ${points.map((p) => p.join(',')).join(' L ')}`;
  }, [route]);

  if (!route) return null;

  return (
    <g>
      <defs>
        <filter
          id={`route-glow-${routeId}`}
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
        >
          <feGaussianBlur stdDeviation="5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Glow background path */}
      <path
        d={pathD}
        fill="none"
        stroke={route.glowColor}
        strokeWidth={6}
        opacity={0.3}
        filter={`url(#route-glow-${routeId})`}
      />

      {/* Main animated drawing path */}
      <motion.path
        d={pathD}
        fill="none"
        stroke={route.color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2.5, ease: 'easeInOut' }}
      />

      {/* Traveling dot with glow */}
      <g>
        <circle r={10} fill={route.glowColor} opacity={0.35}>
          <animateMotion
            dur="2.5s"
            repeatCount="1"
            path={pathD}
            fill="freeze"
          />
        </circle>
        <circle r={5} fill={route.color} stroke="#f5f0e8" strokeWidth={2}>
          <animateMotion
            dur="2.5s"
            repeatCount="1"
            path={pathD}
            fill="freeze"
          />
        </circle>
      </g>

      {/* Waypoints */}
      {route.waypoints.map((wp, i) => {
        const [cx, cy] = project(wp.coordinates[0], wp.coordinates[1]);
        return (
          <g
            key={wp.name}
            className="cursor-pointer"
            onMouseEnter={() => setTooltip({ x: cx, y: cy, waypoint: wp })}
            onMouseLeave={() => setTooltip(null)}
          >
            {/* Pulsing glow ring */}
            <circle cx={cx} cy={cy} r={8} fill={route.glowColor} opacity={0.3}>
              <animate
                attributeName="r"
                values="6;13;6"
                dur="2s"
                repeatCount="indefinite"
                begin={`${0.3 + i * 0.15}s`}
              />
              <animate
                attributeName="opacity"
                values="0.3;0.05;0.3"
                dur="2s"
                repeatCount="indefinite"
                begin={`${0.3 + i * 0.15}s`}
              />
            </circle>

            {/* Waypoint dot */}
            <motion.circle
              cx={cx}
              cy={cy}
              r={4}
              fill={route.color}
              stroke="#f5f0e8"
              strokeWidth={1.5}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 0.3 + i * 0.15,
                type: 'spring',
                stiffness: 300,
                damping: 15,
              }}
            />
          </g>
        );
      })}

      {/* Tooltip */}
      {tooltip && (
        <foreignObject
          x={tooltip.x + 12}
          y={tooltip.y - 55}
          width={220}
          height={85}
          pointerEvents="none"
        >
          <div className="glass-paper rounded-lg px-3 py-2 shadow-xl border border-ink-lighter/20">
            <div className="flex items-center gap-1.5 mb-0.5">
              <MapPin className="h-3 w-3 text-cinnabar shrink-0" />
              <span className="font-bold font-serif text-sm text-ink-black">
                {tooltip.waypoint.name}
              </span>
            </div>
            <p className="text-xs text-ink-medium leading-relaxed">
              {tooltip.waypoint.description}
            </p>
          </div>
        </foreignObject>
      )}
    </g>
  );
}
