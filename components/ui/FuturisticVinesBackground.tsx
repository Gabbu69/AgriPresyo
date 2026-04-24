import React, { useState, useEffect, useCallback, useRef } from 'react';

// --- Math Utilities for Quadratic Bezier Curves ---
const getQuadPoint = (t: number, p0: number[], p1: number[], p2: number[]) => {
  const mt = 1 - t;
  const x = mt * mt * p0[0] + 2 * mt * t * p1[0] + t * t * p2[0];
  const y = mt * mt * p0[1] + 2 * mt * t * p1[1] + t * t * p2[1];
  return { x, y };
};

const getQuadAngle = (t: number, p0: number[], p1: number[], p2: number[]) => {
  const mt = 1 - t;
  const dx = 2 * mt * (p1[0] - p0[0]) + 2 * t * (p2[0] - p1[0]);
  const dy = 2 * mt * (p1[1] - p0[1]) + 2 * t * (p2[1] - p1[1]);
  return (Math.atan2(dy, dx) * 180) / Math.PI;
};

// --- Data Structure ---
type LeafData = { seg: number; t: number; dir: 1 | -1; delay: number };
type VineData = {
  pathDelay: number;
  segments: number[][][]; // Array of [p0, p1, p2]
  leaves: LeafData[];
};

const vinesData: VineData[] = [
  // Vine 1 (Main Left)
  {
    pathDelay: 0,
    segments: [
      [[200, 1100], [300, 800], [250, 600]],
      [[250, 600], [200, 400], [300, 300]],
      [[300, 300], [450, 150], [350, -50]],
    ],
    leaves: [
      { seg: 0, t: 0.2, dir: 1, delay: 1.5 },
      { seg: 0, t: 0.6, dir: -1, delay: 4.5 },

      { seg: 1, t: 0.3, dir: 1, delay: 7.5 },
      { seg: 1, t: 0.8, dir: -1, delay: 9.5 },

      { seg: 2, t: 0.5, dir: 1, delay: 11.5 },
    ]
  },
  // Vine 2 (Main Right)
  {
    pathDelay: 1,
    segments: [
      [[800, 1100], [650, 850], [750, 550]],
      [[750, 550], [850, 400], [780, 300]],
      [[780, 300], [650, 150], [750, -50]],
    ],
    leaves: [
      { seg: 0, t: 0.3, dir: -1, delay: 2.5 },
      { seg: 0, t: 0.7, dir: 1, delay: 5.5 },

      { seg: 1, t: 0.5, dir: -1, delay: 7.5 },

      { seg: 2, t: 0.4, dir: 1, delay: 9.5 },
      { seg: 2, t: 0.8, dir: -1, delay: 11.5 },
    ]
  },
  // Branch Left 1
  {
    pathDelay: 5,
    segments: [[[250, 600], [100, 400], [50, 50]]],
    leaves: [
      { seg: 0, t: 0.5, dir: -1, delay: 6.5 },
    ]
  },
  // Branch Left 2
  {
    pathDelay: 8,
    segments: [[[300, 300], [200, 150], [150, -50]]],
    leaves: [
      { seg: 0, t: 0.6, dir: 1, delay: 9.5 },
    ]
  },
  // Branch Right 1
  {
    pathDelay: 5,
    segments: [
      [[750, 550], [850, 450], [950, 350]],
      [[950, 350], [1050, 250], [900, 100]]
    ],
    leaves: [
      { seg: 0, t: 0.5, dir: 1, delay: 6.5 },
      { seg: 1, t: 0.6, dir: -1, delay: 8.5 },
    ]
  },
  // Branch Right 2
  {
    pathDelay: 9,
    segments: [[[780, 300], [900, 150], [850, -50]]],
    leaves: [
      { seg: 0, t: 0.5, dir: -1, delay: 10.5 },
    ]
  },
  // Bottom Left
  {
    pathDelay: 3,
    segments: [
      [[0, 900], [100, 850], [50, 650]],
      [[50, 650], [0, 450], [-50, 400]]
    ],
    leaves: [
      { seg: 0, t: 0.6, dir: -1, delay: 4.5 },
      { seg: 1, t: 0.4, dir: 1, delay: 6.5 },
    ]
  },
  // Bottom Right
  {
    pathDelay: 4,
    segments: [
      [[1000, 800], [900, 750], [950, 500]],
      [[950, 500], [1000, 250], [1050, 300]]
    ],
    leaves: [
      { seg: 0, t: 0.6, dir: 1, delay: 5.5 },
      { seg: 1, t: 0.5, dir: -1, delay: 7.5 },
    ]
  }
];

// --- Falling leaf type ---
type FallingLeaf = {
  id: string;
  screenX: number;
  screenY: number;
  startTime: number;
  swayOffset: number; // random sway direction seed
  duration: number; // how long to fall (ms)
};

interface Props {
  interactive?: boolean;
  animated?: boolean;
}

const FuturisticVinesBackground: React.FC<Props> = ({ interactive = false, animated = true }) => {
  // Static mode: render a pure SVG with no JS overhead
  if (!animated) {
    return (
      <div className="fixed inset-0 z-[-1] overflow-hidden bg-transparent pointer-events-none" style={{ contain: 'strict' }}>
        <svg
          className="absolute w-full h-full opacity-15 sm:opacity-30 dark:opacity-25 sm:dark:opacity-50"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <g id="neon-leaf-static">
              <path
                d="M 0 0 C 10 -15, 25 -15, 30 0 C 25 15, 10 15, 0 0"
                fill="rgba(34, 197, 94, 0.4)"
                stroke="rgba(34, 197, 94, 0.9)"
                strokeWidth="1.2"
              />
              <line x1="2" y1="0" x2="28" y2="0" stroke="rgba(34, 197, 94, 0.5)" strokeWidth="0.6" />
              <line x1="10" y1="0" x2="16" y2="-7" stroke="rgba(34, 197, 94, 0.35)" strokeWidth="0.4" />
              <line x1="15" y1="0" x2="21" y2="-8" stroke="rgba(34, 197, 94, 0.35)" strokeWidth="0.4" />
              <line x1="20" y1="0" x2="25" y2="-6" stroke="rgba(34, 197, 94, 0.35)" strokeWidth="0.4" />
              <line x1="10" y1="0" x2="16" y2="7" stroke="rgba(34, 197, 94, 0.35)" strokeWidth="0.4" />
              <line x1="15" y1="0" x2="21" y2="8" stroke="rgba(34, 197, 94, 0.35)" strokeWidth="0.4" />
              <line x1="20" y1="0" x2="25" y2="6" stroke="rgba(34, 197, 94, 0.35)" strokeWidth="0.4" />
            </g>
          </defs>
          <g stroke="rgba(34, 197, 94, 0.6)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            {vinesData.map((vine, vIdx) => {
              const d = vine.segments.map((s, i) => {
                if (i === 0) return `M ${s[0][0]} ${s[0][1]} Q ${s[1][0]} ${s[1][1]} ${s[2][0]} ${s[2][1]}`;
                return `Q ${s[1][0]} ${s[1][1]} ${s[2][0]} ${s[2][1]}`;
              }).join(' ');
              return (
                <g key={`vine-${vIdx}`}>
                  <path
                    d={d}
                    style={{ opacity: 1, filter: 'drop-shadow(0 0 4px rgba(34, 197, 94, 0.4))' }}
                  />
                  {vine.leaves.map((leaf, lIdx) => {
                    const seg = vine.segments[leaf.seg];
                    const { x, y } = getQuadPoint(leaf.t, seg[0], seg[1], seg[2]);
                    const curveAngle = getQuadAngle(leaf.t, seg[0], seg[1], seg[2]);
                    const leafAngle = curveAngle + (leaf.dir * 55);
                    return (
                      <g key={`${vIdx}-${lIdx}`} transform={`translate(${x}, ${y}) rotate(${leafAngle})`}>
                        <use
                          href="#neon-leaf-static"
                          style={{ transformOrigin: '0px 0px', opacity: 0.9, filter: 'drop-shadow(0 0 4px rgba(34, 197, 94, 0.4))' }}
                        />
                      </g>
                    );
                  })}
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    );
  }
  const [mounted, setMounted] = useState(false);
  const [fallenLeaves, setFallenLeaves] = useState<Set<string>>(new Set());
  const [fallingLeaves, setFallingLeaves] = useState<FallingLeaf[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Animate falling leaves with requestAnimationFrame
  useEffect(() => {
    if (fallingLeaves.length === 0) return;

    const animate = () => {
      const now = performance.now();
      setFallingLeaves(prev => prev.filter(leaf => {
        const elapsed = now - leaf.startTime;
        return elapsed < leaf.duration;
      }));
      animFrameRef.current = requestAnimationFrame(animate);
    };
    animFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [fallingLeaves.length > 0]);

  const handleLeafClick = useCallback((leafId: string, e: React.MouseEvent) => {
    if (!interactive) return;
    if (fallenLeaves.has(leafId)) return;

    // Get the click position on screen
    const screenX = e.clientX;
    const screenY = e.clientY;

    // Random variation per leaf
    const seed = leafId.split('-').reduce((a, b) => a + parseInt(b), 0);
    const duration = 4000 + (seed % 5) * 400; // 4s to 5.6s

    setFallenLeaves(prev => new Set(prev).add(leafId));
    setFallingLeaves(prev => [...prev, {
      id: leafId,
      screenX,
      screenY,
      startTime: performance.now(),
      swayOffset: Math.random() * Math.PI * 2,
      duration,
    }]);
  }, [interactive, fallenLeaves]);

  if (!mounted) return null;

  return (
    <div ref={containerRef} className={`fixed inset-0 ${interactive ? 'z-[10]' : 'z-[-1]'} overflow-hidden bg-transparent pointer-events-none`} style={{ contain: 'strict', willChange: 'auto' }}>
      <style>
        {`
          @keyframes growVine {
            0% { stroke-dashoffset: 100; opacity: 0; }
            5% { opacity: 1; }
            100% { stroke-dashoffset: 0; opacity: 1; filter: drop-shadow(0 0 4px rgba(34, 197, 94, 0.4)); }
          }

          @keyframes pulseLeafOpacity {
            0%, 100% { opacity: 0.7; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.05); }
          }

          @keyframes bloomLeaf {
            0% { transform: scale(0); opacity: 0; }
            50% { transform: scale(1.3); opacity: 1; }
            100% { transform: scale(1); opacity: 0.9; }
          }

          .vine-path {
            stroke-dasharray: 100;
            stroke-dashoffset: 100;
          }
          
          .leaf-interactive {
            cursor: pointer;
            pointer-events: auto;
            transition: filter 0.3s ease, fill 0.3s ease;
          }
          
          .leaf-interactive:hover {
            filter: drop-shadow(0 0 15px rgba(34, 197, 94, 1)) brightness(1.2);
            fill: rgba(34, 197, 94, 0.8);
          }

          .falling-leaf-html {
            position: fixed;
            pointer-events: none;
            z-index: 11;
            will-change: transform, opacity;
          }
        `}
      </style>

      <svg
        ref={svgRef}
        className="absolute w-full h-full opacity-15 sm:opacity-30 dark:opacity-25 sm:dark:opacity-50"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <g id="neon-leaf">
            <path
              d="M 0 0 C 10 -15, 25 -15, 30 0 C 25 15, 10 15, 0 0"
              fill="rgba(34, 197, 94, 0.4)"
              stroke="rgba(34, 197, 94, 0.9)"
              strokeWidth="1.2"
            />
            {/* Leaf veins */}
            <line x1="2" y1="0" x2="28" y2="0" stroke="rgba(34, 197, 94, 0.5)" strokeWidth="0.6" />
            <line x1="10" y1="0" x2="16" y2="-7" stroke="rgba(34, 197, 94, 0.35)" strokeWidth="0.4" />
            <line x1="15" y1="0" x2="21" y2="-8" stroke="rgba(34, 197, 94, 0.35)" strokeWidth="0.4" />
            <line x1="20" y1="0" x2="25" y2="-6" stroke="rgba(34, 197, 94, 0.35)" strokeWidth="0.4" />
            <line x1="10" y1="0" x2="16" y2="7" stroke="rgba(34, 197, 94, 0.35)" strokeWidth="0.4" />
            <line x1="15" y1="0" x2="21" y2="8" stroke="rgba(34, 197, 94, 0.35)" strokeWidth="0.4" />
            <line x1="20" y1="0" x2="25" y2="6" stroke="rgba(34, 197, 94, 0.35)" strokeWidth="0.4" />
          </g>
        </defs>

        <g stroke="rgba(34, 197, 94, 0.6)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
          {vinesData.map((vine, vIdx) => {
            const d = vine.segments.map((s, i) => {
              if (i === 0) return `M ${s[0][0]} ${s[0][1]} Q ${s[1][0]} ${s[1][1]} ${s[2][0]} ${s[2][1]}`;
              return `Q ${s[1][0]} ${s[1][1]} ${s[2][0]} ${s[2][1]}`;
            }).join(' ');

            return (
              <g key={`vine-${vIdx}`}>
                <path
                  className="vine-path"
                  d={d}
                  pathLength="100"
                  style={{
                    animation: animated ? `growVine 12s cubic-bezier(0.25, 1, 0.5, 1) ${vine.pathDelay}s forwards` : 'none',
                    strokeDashoffset: animated ? undefined : 0,
                    opacity: animated ? undefined : 1,
                    filter: animated ? undefined : 'drop-shadow(0 0 4px rgba(34, 197, 94, 0.4))'
                  }}
                />

                {vine.leaves.map((leaf, lIdx) => {
                  const seg = vine.segments[leaf.seg];
                  const { x, y } = getQuadPoint(leaf.t, seg[0], seg[1], seg[2]);
                  const curveAngle = getQuadAngle(leaf.t, seg[0], seg[1], seg[2]);
                  const leafAngle = curveAngle + (leaf.dir * 55);

                  const leafId = `${vIdx}-${lIdx}`;
                  const isFallen = fallenLeaves.has(leafId);

                  return (
                    <g key={leafId} transform={`translate(${x}, ${y}) rotate(${leafAngle})`}>
                      {!isFallen && (
                        <use
                          href="#neon-leaf"
                          className={interactive ? 'leaf-interactive' : ''}
                          onClick={(e) => handleLeafClick(leafId, e)}
                          style={{
                            transformOrigin: '0px 0px',
                            transform: animated ? 'scale(0)' : 'scale(1)',
                            opacity: animated ? 0 : 0.9,
                            animation: animated ? `bloomLeaf 2s cubic-bezier(0.34, 1.56, 0.64, 1) ${leaf.delay}s forwards` : 'none',
                            filter: 'drop-shadow(0 0 4px rgba(34, 197, 94, 0.4))'
                          }}
                        />
                      )}
                    </g>
                  );
                })}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Falling leaves rendered as HTML elements outside SVG */}
      {fallingLeaves.map(leaf => (
        <FallingLeafElement key={leaf.id} leaf={leaf} />
      ))}
    </div>
  );
};

// Separate component for each falling leaf - uses requestAnimationFrame for smooth physics
const FallingLeafElement: React.FC<{ leaf: FallingLeaf }> = ({ leaf }) => {
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    let rafId: number;
    const screenH = window.innerHeight;
    const totalFallDistance = screenH - leaf.screenY + 100; // fall to bottom + buffer

    const animate = () => {
      const now = performance.now();
      const elapsed = now - leaf.startTime;
      const progress = Math.min(elapsed / leaf.duration, 1); // 0 → 1

      // Smooth eased progress (ease-out quad for gravity-like feel)
      const eased = 1 - (1 - progress) * (1 - progress);

      // Vertical: fall downward
      const dy = eased * totalFallDistance;

      // Horizontal: gentle sine-wave sway
      const swayAmount = 20;
      const swaySpeed = 3;
      const dx = Math.sin(progress * Math.PI * swaySpeed + leaf.swayOffset) * swayAmount;

      // Rotation: gentle rocking
      const rotation = Math.sin(progress * Math.PI * swaySpeed * 1.3 + leaf.swayOffset) * 15;


      // Opacity: fade out in last 40%
      const opacity = progress > 0.6 ? 1 - (progress - 0.6) / 0.4 : 0.9;

      el.style.transform = `translate(${dx}px, ${dy}px) rotate(${rotation}deg)`;
      el.style.opacity = `${Math.max(0, opacity)}`;

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [leaf]);

  return (
    <div
      ref={elRef}
      className="falling-leaf-html"
      style={{
        left: leaf.screenX - 10,
        top: leaf.screenY - 8,
      }}
    >
      <svg width="24" height="18" viewBox="-2 -17 34 34" style={{ filter: 'drop-shadow(0 0 6px rgba(34, 197, 94, 0.6))' }}>
        <path
          d="M 0 0 C 10 -15, 25 -15, 30 0 C 25 15, 10 15, 0 0"
          fill="rgba(34, 197, 94, 0.5)"
          stroke="rgba(34, 197, 94, 0.9)"
          strokeWidth="1.2"
        />
        {/* Leaf veins */}
        <line x1="2" y1="0" x2="28" y2="0" stroke="rgba(34, 197, 94, 0.5)" strokeWidth="0.6" />
        <line x1="10" y1="0" x2="16" y2="-7" stroke="rgba(34, 197, 94, 0.35)" strokeWidth="0.4" />
        <line x1="15" y1="0" x2="21" y2="-8" stroke="rgba(34, 197, 94, 0.35)" strokeWidth="0.4" />
        <line x1="20" y1="0" x2="25" y2="-6" stroke="rgba(34, 197, 94, 0.35)" strokeWidth="0.4" />
        <line x1="10" y1="0" x2="16" y2="7" stroke="rgba(34, 197, 94, 0.35)" strokeWidth="0.4" />
        <line x1="15" y1="0" x2="21" y2="8" stroke="rgba(34, 197, 94, 0.35)" strokeWidth="0.4" />
        <line x1="20" y1="0" x2="25" y2="6" stroke="rgba(34, 197, 94, 0.35)" strokeWidth="0.4" />
      </svg>
    </div>
  );
};

export default React.memo(FuturisticVinesBackground);
