"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";

// Paste this file as app/duck-race-canvas/page.tsx
// Requires Tailwind (optional, only for buttons/layout). Game rendering uses <canvas> only.

export default function DuckRaceCanvas() {
  const CANVAS_W = 1100; // logical width (will be scaled by DPR)
  const CANVAS_H = 520;  // logical height
  const LANE_COUNT = 5;
  const MARGIN = 24;
  const TICK_MS = 16; // target tick ~60fps

  type Duck = {
    id: number;
    name: string;
    color: string; // body color
    x: number;     // progress in pixels
    lane: number;  // 0..LANE_COUNT-1
    finishedAt?: number;
  };

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef<number>(0);

  const [isRacing, _setIsRacing] = useState(false);
  const racingRef = useRef(false);
  const setIsRacing = (val: boolean) => {
    racingRef.current = val;
    _setIsRacing(val);
  };
  const [countdown, setCountdown] = useState<number | null>(null);
  const [seed, setSeed] = useState(() => Math.random());
  const [winners, setWinners] = useState<Duck[]>([]);

  // palette + names
  const palette = ["#facc15", "#22c55e", "#60a5fa", "#f97316", "#a78bfa", "#10b981"];
  const names = ["Vịt Lá Mơ", "Vịt Tốc Hành", "Vịt Cà Phê", "Vịt Lướt Gió", "Vịt Siêu Tốc", "Vịt Bão"];

  const ducksBase = useMemo(() =>
    Array.from({ length: LANE_COUNT }).map((_, i) => ({
      id: i + 1,
      name: names[i % names.length],
      color: palette[i % palette.length],
      x: 0,
      lane: i,
    })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [LANE_COUNT]);

  const [ducks, setDucks] = useState<Duck[]>(ducksBase);

  // seeded RNG
  function rngFactory(a: number) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t ^= t + Math.imul(t ^ (t >>> 7), 61 | t); return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const rng = useMemo(() => rngFactory(Math.floor(seed * 1e9)), [seed]);
  const personalities = useMemo(() => ducks.map(() => 0.8 + rng() * 0.6), // per-duck multiplier
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [seed]);

  const trackRect = useMemo(() => ({
    x: MARGIN,
    y: MARGIN + 60,
    w: CANVAS_W - MARGIN * 2,
    h: CANVAS_H - (MARGIN + 60) - MARGIN,
  }), []);

  const finishX = trackRect.x + trackRect.w - 80; // line before banner

  const reset = () => {
    cancelAnim();
    setIsRacing(false);
    setCountdown(null);
    setWinners([]);
    setSeed(Math.random());
    setDucks(ducksBase.map(d => ({ ...d, x: 0, finishedAt: undefined })));
  };

  const cancelAnim = () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); rafRef.current = null; };

  // responsive: size canvas to container width while keeping aspect
  useEffect(() => {
    const canvas = canvasRef.current!;
    const resize = () => {
      if (!canvas) return;
      const parent = canvas.parentElement!;
      const ratio = CANVAS_W / CANVAS_H;
      const width = Math.min(parent.clientWidth, CANVAS_W);
      const height = Math.round(width / ratio);
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      const ctx = canvas.getContext("2d")!;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // scale to CSS pixels
      draw(ctx); // initial draw
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // main loop
  const loop = () => {
    rafRef.current = requestAnimationFrame((now) => {
      const dt = Math.min(100, now - (lastRef.current || now));
      if (dt >= TICK_MS) {
        update(dt);
        lastRef.current = now;
      }
      if (racingRef.current) loop(); // race only if button is clicked
    });
  };

  const startCountdown = async () => {
    if (isRacing || countdown !== null) return;
    setWinners([]);
    setCountdown(3); await delay(700);
    setCountdown(2); await delay(700);
    setCountdown(1); await delay(700);
    setCountdown(0); await delay(400);
    setCountdown(null); setIsRacing(true); lastRef.current = performance.now(); loop();
  };

  function update(dt: number) {
    setDucks(prev => {
      const next = prev.map((d, i) => {
        if (d.x >= finishX - trackRect.x) return d;
        const base = 0.9 * personalities[i];
        const jitter = (rng() - 0.5) * 0.35;
        const sprint = rng() < 0.05 ? 2 + rng() * 1.5 : 0; // burst sometimes
        const dx = Math.max(0.2, (base + jitter + sprint)) * (dt / 16.67);
        const nx = Math.min(finishX - trackRect.x, d.x + dx);
        return { ...d, x: nx };
      });

      // mark finish times
      const now = performance.now();
      const withTime = next.map((d, i) => {
        const realX = d.x + trackRect.x;
        if (realX >= finishX && !prev[i].finishedAt) return { ...d, finishedAt: now + i * 0.0001 };
        return { ...d, finishedAt: prev[i].finishedAt };
      });

      const finished = withTime.filter(d => d.finishedAt).sort((a, b) => (a.finishedAt! - b.finishedAt!));
      setWinners(finished);

      const allDone = withTime.every(d => (d.x + trackRect.x) >= finishX);
      if (allDone) { setIsRacing(false); cancelAnim(); }

      // draw
      const ctx = canvasRef.current!.getContext("2d")!;
      draw(ctx, withTime);

      return withTime;
    });
  }

  function draw(ctx: CanvasRenderingContext2D, ducksState: Duck[] = ducks) {
    // clear
    ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);

    // sky
    rect(ctx, 0, 0, CANVAS_W, CANVAS_H, "#e0f2fe");
    // grass
    rect(ctx, 0, CANVAS_H - 150, CANVAS_W, 150, "#bbf7d0");

    // title
    ctx.fillStyle = "#111827"; ctx.font = "bold 28px ui-sans-serif"; ctx.fillText("🏁 Đua Vịt (Canvas)", MARGIN, 44);

    // track background
    rect(ctx, trackRect.x, trackRect.y, trackRect.w, trackRect.h, "#f5f5f4");

    // lanes
    const laneH = trackRect.h / LANE_COUNT;
    for (let i = 0; i < LANE_COUNT; i++) {
      const y = trackRect.y + i * laneH;
      // lane color
      rect(ctx, trackRect.x, y, trackRect.w, laneH - 8, i % 2 ? "#e7e5e4" : "#f3f4f6");
      // separator
      ctx.strokeStyle = "#d4d4d8"; ctx.lineWidth = 2; line(ctx, trackRect.x, y + laneH - 8, trackRect.x + trackRect.w, y + laneH - 8);
      // lane id
      ctx.fillStyle = "#6b7280"; ctx.font = "12px ui-sans-serif"; ctx.fillText(`#${i + 1}`, trackRect.x + 8, y + 16);
    }

    // finish flag + line
    ctx.strokeStyle = "#9ca3af"; ctx.lineWidth = 3; line(ctx, finishX, trackRect.y, finishX, trackRect.y + trackRect.h);
    rect(ctx, finishX + 8, trackRect.y + trackRect.h / 2 - 24, 80, 32, "#ef4444");
    ctx.fillStyle = "#fff"; ctx.font = "bold 16px ui-sans-serif"; ctx.fillText("FINISH", finishX + 20, trackRect.y + trackRect.h / 2 - 3);

    // ducks
    ducksState.forEach((d) => {
      const laneY = trackRect.y + d.lane * laneH + laneH / 2 - 10;
      const x = trackRect.x + d.x;
      drawDuck(ctx, x, laneY, d.color);
      // name
      ctx.fillStyle = "#374151"; ctx.font = "12px ui-sans-serif"; ctx.fillText(d.name, trackRect.x + 10, laneY + laneH / 2 - 16);
    });

    // winners box
    if (winners.length > 0) {
      ctx.fillStyle = "rgba(0,0,0,0.5)"; rect(ctx, MARGIN, CANVAS_H - 60, 360, 38, "rgba(0,0,0,0.55)");
      ctx.fillStyle = "#fff"; ctx.font = "14px ui-sans-serif"; ctx.fillText("Xếp hạng: " + winners.map((d, i) => `${i + 1}. #${d.id}`).join("  "), MARGIN + 10, CANVAS_H - 36);
    }

    // countdown overlay
    if (countdown !== null) {
      ctx.fillStyle = "rgba(0,0,0,0.4)"; rect(ctx, 0, 0, CANVAS_W, CANVAS_H, "rgba(0,0,0,0.4)");
      const text = countdown === 0 ? "GO!" : String(countdown);
      ctx.fillStyle = countdown === 0 ? "#22c55e" : countdown === 1 ? "#ef4444" : countdown === 2 ? "#f59e0b" : "#fbbf24";
      ctx.font = "bold 96px ui-sans-serif"; const tw = ctx.measureText(text).width; ctx.fillText(text, (CANVAS_W - tw) / 2, CANVAS_H / 2);
    }
  }

  function drawDuck(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
    // body
    ctx.save();
    ctx.translate(x, y);
    // subtle bobbing
    const t = performance.now() / 400; ctx.translate(0, Math.sin(t + x * 0.01) * 1.2);

    // body ellipse
    ctx.fillStyle = color; ellipse(ctx, 0, 0, 26, 16);
    // wing
    ctx.fillStyle = shade(color, -12); ellipse(ctx, -4, -2, 10, 7);
    // head
    ellipse(ctx, 18, -8, 10, 10);
    // beak
    ctx.fillStyle = "#f97316"; triangle(ctx, 26, -8, 36, -6, 26, -2);
    // eye
    ctx.fillStyle = "#111827"; ellipse(ctx, 20, -10, 2, 2);
    // feet
    ctx.fillStyle = "#fb923c"; triangle(ctx, -10, 10, -4, 12, -8, 14); triangle(ctx, 2, 10, 8, 12, 4, 14);

    ctx.restore();
  }

  // helpers
  function rect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, fill: string) {
    const fs = ctx.fillStyle; ctx.fillStyle = fill; ctx.fillRect(x, y, w, h); ctx.fillStyle = fs as any;
  }
  function line(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) {
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  }
  function ellipse(ctx: CanvasRenderingContext2D, x: number, y: number, rx: number, ry: number) {
    ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.fill();
  }
  function triangle(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) {
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.lineTo(x3, y3); ctx.closePath(); ctx.fill();
  }
  function shade(hex: string, amt: number) {
    // simple shade adjuster
    let c = hex.replace('#', ''); if (c.length === 3) c = c.split('').map((x) => x + x).join('');
    const num = parseInt(c, 16); const r = Math.min(255, Math.max(0, (num >> 16) + amt));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amt));
    const b = Math.min(255, Math.max(0, (num & 0xff) + amt));
    return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
  }
  const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

  // draw initial on mount & when state changes that matters (like winners)
  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) draw(ctx);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countdown]);

  useEffect(() => () => cancelAnim(), []);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-neutral-100 text-neutral-900 p-6">
      <div className="w-full max-w-6xl">
        <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">🏁 Đua Vịt – Canvas</h1>
            <p className="text-neutral-600">Phiên bản render hoàn toàn bằng &lt;canvas&gt;.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={startCountdown} className="px-4 py-2 rounded-xl bg-emerald-500 text-white">Bắt đầu</button>
            <button onClick={() => { setIsRacing((v: boolean) => { if (!v) { lastRef.current = performance.now(); loop(); } else cancelAnim(); return !v; }); }}
              className="px-4 py-2 rounded-xl bg-sky-500 text-white">{isRacing ? "Tạm dừng" : "Tiếp tục"}</button>
            <button onClick={reset} className="px-4 py-2 rounded-xl bg-neutral-800 text-white">Làm mới</button>
          </div>
        </header>

        <div className="bg-white rounded-2xl shadow border border-neutral-200 p-3">
          <div className="w-full">
            <canvas ref={canvasRef} style={{ width: "100%", height: "auto", display: "block" }} />
          </div>
        </div>
      </div>
    </div>
  );
}