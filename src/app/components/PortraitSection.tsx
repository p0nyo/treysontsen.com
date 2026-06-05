'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

// ─── Tetris constants ──────────────────────────────────────────────────────────

const W = 10;
const H = 20;

const PIECES: number[][][] = [
  [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]], // I (4×4 for correct SRS kicks)
  [[1, 1], [1, 1]],                           // O
  [[0, 1, 0], [1, 1, 1]],                     // T
  [[0, 1, 1], [1, 1, 0]],                     // S
  [[1, 1, 0], [0, 1, 1]],                     // Z
  [[1, 0, 0], [1, 1, 1]],                     // J
  [[0, 0, 1], [1, 1, 1]],                     // L
];

type Board = number[][];

function emptyBoard(): Board {
  return Array.from({ length: H }, () => Array(W).fill(0));
}

function randomPieceType() {
  return Math.floor(Math.random() * PIECES.length);
}

// SRS kick tables: key = "fromRot>toRot", value = [[dx,dy], ...]
const KICKS_JLSZT: Record<string, [number, number][]> = {
  '0>1': [[0,0],[-1,0],[-1,1],[0,-2],[-1,-2]],
  '1>0': [[0,0],[1,0],[1,-1],[0,2],[1,2]],
  '1>2': [[0,0],[1,0],[1,-1],[0,2],[1,2]],
  '2>1': [[0,0],[-1,0],[-1,1],[0,-2],[-1,-2]],
  '2>3': [[0,0],[1,0],[1,1],[0,-2],[1,-2]],
  '3>2': [[0,0],[-1,0],[-1,-1],[0,2],[-1,2]],
  '3>0': [[0,0],[-1,0],[-1,-1],[0,2],[-1,2]],
  '0>3': [[0,0],[1,0],[1,1],[0,-2],[1,-2]],
};

const KICKS_I: Record<string, [number, number][]> = {
  '0>1': [[0,0],[-2,0],[1,0],[-2,-1],[1,2]],
  '1>0': [[0,0],[2,0],[-1,0],[2,1],[-1,-2]],
  '1>2': [[0,0],[-1,0],[2,0],[-1,2],[2,-1]],
  '2>1': [[0,0],[1,0],[-2,0],[1,-2],[-2,1]],
  '2>3': [[0,0],[2,0],[-1,0],[2,1],[-1,-2]],
  '3>2': [[0,0],[-2,0],[1,0],[-2,-1],[1,2]],
  '3>0': [[0,0],[1,0],[-2,0],[1,-2],[-2,1]],
  '0>3': [[0,0],[-1,0],[2,0],[-1,2],[2,-1]],
};

function getKicks(pieceType: number, fromRot: number, toRot: number): [number, number][] {
  if (pieceType === 1) return [[0, 0]]; // O piece, no kicks
  const table = pieceType === 0 ? KICKS_I : KICKS_JLSZT;
  return table[`${fromRot}>${toRot}`] ?? [[0, 0]];
}

function tryRotate(
  board: Board,
  shape: number[][],
  pos: { x: number; y: number },
  pieceType: number,
  fromRot: number,
  rotFn: (s: number[][]) => number[][],
  toRot: number
): { shape: number[][]; pos: { x: number; y: number }; rot: number } | null {
  const rotated = rotFn(shape);
  const kicks = getKicks(pieceType, fromRot, toRot);
  for (const [dx, dy] of kicks) {
    const nx = pos.x + dx;
    const ny = pos.y + dy;
    if (fits(board, rotated, nx, ny)) return { shape: rotated, pos: { x: nx, y: ny }, rot: toRot };
  }
  return null;
}

function rotateCW(shape: number[][]): number[][] {
  return shape[0].map((_, i) => shape.map(row => row[i]).reverse());
}

function rotateCCW(shape: number[][]): number[][] {
  return shape[0].map((_, i) => shape.map(row => row[row.length - 1 - i]));
}

function rotate180(shape: number[][]): number[][] {
  return rotateCW(rotateCW(shape));
}

function fits(board: Board, shape: number[][], x: number, y: number): boolean {
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (!shape[r][c]) continue;
      const nr = y + r, nc = x + c;
      if (nr < 0 || nr >= H || nc < 0 || nc >= W) return false;
      if (board[nr][nc]) return false;
    }
  }
  return true;
}

function place(board: Board, shape: number[][], x: number, y: number): Board {
  const b = board.map(r => [...r]);
  for (let r = 0; r < shape.length; r++)
    for (let c = 0; c < shape[r].length; c++)
      if (shape[r][c]) b[y + r][x + c] = 1;
  return b;
}

function clearLines(board: Board): { board: Board; lines: number } {
  const kept = board.filter(row => row.some(c => !c));
  const lines = H - kept.length;
  const newRows = Array.from({ length: lines }, () => Array(W).fill(0));
  return { board: [...newRows, ...kept], lines };
}

function ghostY(board: Board, shape: number[][], px: number, py: number): number {
  let gy = py;
  while (fits(board, shape, px, gy + 1)) gy++;
  return gy;
}

function renderBoard(board: Board, shape: number[][], px: number, py: number, over: boolean): string {
  const display = board.map(r => [...r]);
  if (!over) {
    const gy = ghostY(board, shape, px, py);
    for (let r = 0; r < shape.length; r++)
      for (let c = 0; c < shape[r].length; c++)
        if (shape[r][c] && gy + r >= 0 && gy + r < H && px + c >= 0 && px + c < W)
          display[gy + r][px + c] = 3;
    for (let r = 0; r < shape.length; r++)
      for (let c = 0; c < shape[r].length; c++)
        if (shape[r][c] && py + r >= 0 && py + r < H && px + c >= 0 && px + c < W)
          display[py + r][px + c] = 2;
  }
  const lines: string[] = [];
  lines.push('+' + '--'.repeat(W) + '+');
  for (const row of display) {
    lines.push('|' + row.map(c => (c === 2 ? '[]' : c === 3 ? '::' : c ? '##' : '  ')).join('') + '|');
  }
  lines.push('+' + '--'.repeat(W) + '+');
  return lines.join('\n');
}

// ─── Keybinds ─────────────────────────────────────────────────────────────────

const DEFAULT_BINDS = {
  left: 'ArrowLeft', right: 'ArrowRight',
  softDrop: 'ArrowDown', hardDrop: ' ',
  rotateCW: 'ArrowUp', rotateCCW: null as string | null, rotate180: null as string | null,
  hold: 'c' as string | null, reset: 'r', exit: 'Escape',
};

const MY_BINDS = {
  left: 'l', right: "'",
  softDrop: ';', hardDrop: 'p',
  rotateCW: 'd', rotateCCW: 'a', rotate180: 's',
  hold: ' ', reset: 'r', exit: 'Escape',
};

type Binds = typeof DEFAULT_BINDS;

// ─── Tetris component ──────────────────────────────────────────────────────────

const STORAGE_KEY = 'tetris-settings';

function loadSettings(): { binds: Binds; das: number; arr: number; sdf: number } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      return {
        binds: { ...DEFAULT_BINDS, ...saved.binds },
        das: saved.das ?? 167,
        arr: saved.arr ?? 33,
        sdf: saved.sdf ?? 33,
      };
    }
  } catch {}
  return { binds: { ...DEFAULT_BINDS }, das: 167, arr: 33, sdf: 33 };
}

function TetrisGame({ onExit }: { onExit: () => void }) {
  const [board, setBoard] = useState<Board>(emptyBoard);
  const [queue, setQueue] = useState<number[]>(() => Array.from({ length: 5 }, randomPieceType));
  const [pieceType, setPieceType] = useState(() => randomPieceType());
  const [shape, setShape] = useState<number[][]>(() => PIECES[pieceType]);
  const [rot, setRot] = useState(0);
  const [pos, setPos] = useState({ x: 3, y: 0 });
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);
  const [lines, setLines] = useState(0);
  const [held, setHeld] = useState<number | null>(null);
  const [canHold, setCanHold] = useState(true);
  const [binds, setBinds] = useState<Binds>(() => loadSettings().binds);
  const [das, setDas] = useState(() => loadSettings().das);
  const [arr, setArr] = useState(() => loadSettings().arr);
  const [sdf, setSdf] = useState(() => loadSettings().sdf);
  const [showSettings, setShowSettings] = useState(false);
  const [pendingBinds, setPendingBinds] = useState<Binds>({ ...DEFAULT_BINDS });
  const [pendingDas, setPendingDas] = useState(167);
  const [pendingArr, setPendingArr] = useState(33);
  const [pendingSdf, setPendingSdf] = useState(33);
  const [listeningFor, setListeningFor] = useState<keyof Binds | null>(null);

  const stateRef = useRef({ board, shape, pos, rot, pieceType, queue, over, held, canHold, binds });
  stateRef.current = { board, shape, pos, rot, pieceType, queue, over, held, canHold, binds };
  const showSettingsRef = useRef(false);
  showSettingsRef.current = showSettings;
  const listeningForRef = useRef<keyof Binds | null>(null);
  listeningForRef.current = listeningFor;
  const dasRef = useRef(das);
  const arrRef = useRef(arr);
  const sdfRef = useRef(sdf);
  dasRef.current = das;
  arrRef.current = arr;
  sdfRef.current = sdf;

  const dasTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const arrTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const sdfTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const lockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchingGround = useRef(false);

  const clearLock = () => { if (lockTimer.current) { clearTimeout(lockTimer.current); lockTimer.current = null; } };

  const lockRef = useRef<((b: Board, s: number[][], p: { x: number; y: number }) => void) | null>(null);

  const startLockTimer = () => {
    clearLock();
    lockTimer.current = setTimeout(() => {
      const { board: b2, shape: s2, pos: p2 } = stateRef.current;
      lockRef.current?.(b2, s2, p2);
    }, 500);
  };

  const clearMovement = useCallback(() => {
    if (dasTimer.current) clearTimeout(dasTimer.current);
    if (arrTimer.current) clearInterval(arrTimer.current);
  }, []);

  const clearSdf = useCallback(() => {
    if (sdfTimer.current) { clearInterval(sdfTimer.current); sdfTimer.current = null; }
  }, []);

  const spawn = useCallback((b: Board, nextType?: number) => {
    touchingGround.current = false;
    const { queue: q } = stateRef.current;
    const pt = nextType ?? q[0];
    const newQueue = nextType != null ? q : [...q.slice(1), randomPieceType()];
    const s = PIECES[pt];
    const p = { x: Math.floor((W - s[0].length) / 2), y: 0 };
    if (!fits(b, s, p.x, p.y)) { setOver(true); }
    else { setQueue(newQueue); setPieceType(pt); setShape(s); setRot(0); setPos(p); setBoard(b); setCanHold(true); }
  }, []);

  const lock = useCallback((b: Board, s: number[][], p: { x: number; y: number }) => {
    clearSdf();
    clearLock();
    touchingGround.current = false;
    const placed = place(b, s, p.x, p.y);
    const { board: cleared, lines: l } = clearLines(placed);
    setScore(sc => sc + l * 100 + 10);
    setLines(ln => ln + l);
    spawn(cleared);
  }, [spawn, clearSdf]);

  lockRef.current = lock;

  const drop = useCallback(() => {
    const { board: b, shape: s, pos: p, over: o } = stateRef.current;
    if (o) return;
    const ny = p.y + 1;
    if (fits(b, s, p.x, ny)) {
      touchingGround.current = false;
      clearLock();
      setPos({ x: p.x, y: ny });
    } else {
      if (!touchingGround.current) {
        touchingGround.current = true;
        startLockTimer();
      }
    }
  }, [lock]);

  const reset = useCallback(() => {
    clearMovement();
    const pt = randomPieceType();
    const newQueue = Array.from({ length: 5 }, randomPieceType);
    setBoard(emptyBoard()); setQueue(newQueue); setPieceType(pt); setShape(PIECES[pt]); setRot(0); setPos({ x: 3, y: 0 });
    setScore(0); setLines(0); setOver(false); setHeld(null); setCanHold(true);
    touchingGround.current = false;
  }, [clearMovement]);

  const startMoving = useCallback((dir: 'left' | 'right') => {
    const dx = dir === 'left' ? -1 : 1;
    const doMove = () => {
      const { board: b, shape: s, pos: p, over: o } = stateRef.current;
      if (o) return;
      if (arrRef.current === 0) {
        let nx = p.x;
        while (fits(b, s, nx + dx, p.y)) nx += dx;
        if (nx !== p.x) { setPos({ x: nx, y: p.y }); if (touchingGround.current) startLockTimer(); }
      } else {
        if (fits(b, s, p.x + dx, p.y)) { setPos(prev => ({ ...prev, x: prev.x + dx })); if (touchingGround.current) startLockTimer(); }
      }
    };
    clearMovement();
    doMove();
    dasTimer.current = setTimeout(() => {
      if (arrRef.current === 0) { doMove(); return; }
      arrTimer.current = setInterval(doMove, arrRef.current);
    }, dasRef.current);
  }, [clearMovement]);

  useEffect(() => {
    if (over || showSettings) return;
    const speed = Math.max(150, 500 - Math.floor(lines / 5) * 50);
    const id = setInterval(drop, speed);
    return () => clearInterval(id);
  }, [drop, over, lines, showSettings]);

  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      if (showSettingsRef.current) {
        if (e.key === 'Escape' && !listeningForRef.current) setShowSettings(false);
        return;
      }
      const { board: b, shape: s, pos: p, rot: cr, pieceType: pt, over: o, held: h, canHold: ch, binds: kb } = stateRef.current;
      if (kb.exit && e.key === kb.exit) { onExit(); return; }
      if (o) { if (e.key === kb.reset) reset(); return; }

      if (e.key === kb.left) { e.preventDefault(); startMoving('left'); }
      else if (e.key === kb.right) { e.preventDefault(); startMoving('right'); }
      else if (e.key === kb.rotateCW) {
        const res = tryRotate(b, s, p, pt, cr, rotateCW, (cr + 1) % 4);
        if (res) { setShape(res.shape); setPos(res.pos); setRot(res.rot); if (touchingGround.current) startLockTimer(); }
      } else if (kb.rotateCCW && e.key === kb.rotateCCW) {
        const res = tryRotate(b, s, p, pt, cr, rotateCCW, (cr + 3) % 4);
        if (res) { setShape(res.shape); setPos(res.pos); setRot(res.rot); if (touchingGround.current) startLockTimer(); }
      } else if (kb.rotate180 && e.key === kb.rotate180) {
        const mid = tryRotate(b, s, p, pt, cr, rotateCW, (cr + 1) % 4);
        if (mid) {
          const res = tryRotate(b, mid.shape, mid.pos, pt, mid.rot, rotateCW, (mid.rot + 1) % 4);
          if (res) { setShape(res.shape); setPos(res.pos); setRot(res.rot); if (touchingGround.current) startLockTimer(); }
        }
      } else if (e.key === kb.softDrop) {
        if (!e.repeat) {
          drop();
          clearSdf();
          sdfTimer.current = setInterval(() => drop(), sdfRef.current);
        }
      } else if (e.key === kb.hardDrop) {
        e.preventDefault();
        let ny = p.y;
        while (fits(b, s, p.x, ny + 1)) ny++;
        lock(b, s, { x: p.x, y: ny });
      } else if (kb.hold && e.key === kb.hold) {
        e.preventDefault();
        if (!ch) return;
        setCanHold(false);
        const nextType = h ?? stateRef.current.queue[0];
        const next = PIECES[nextType];
        setHeld(pt);
        if (h == null) setQueue(q => [...q.slice(1), randomPieceType()]);
        const sp = { x: Math.floor((W - next[0].length) / 2), y: 0 };
        if (!fits(b, next, sp.x, sp.y)) { setOver(true); return; }
        setPieceType(nextType);
        setShape(next); setRot(0); setPos(sp);
        touchingGround.current = false; clearLock();
      } else if (e.key === kb.reset) {
        reset();
      }
    };

    const onUp = (e: KeyboardEvent) => {
      const kb = stateRef.current.binds;
      if (e.key === kb.left || e.key === kb.right) clearMovement();
      if (e.key === kb.softDrop) clearSdf();
    };

    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
      clearMovement();
      clearSdf();
    };
  }, [drop, lock, reset, spawn, onExit, startMoving, clearMovement, clearSdf]);

  useEffect(() => {
    if (!listeningFor) return;
    const handler = (e: KeyboardEvent) => {
      e.preventDefault(); e.stopPropagation();
      if (e.key === 'Escape') { setListeningFor(null); return; }
      setPendingBinds(b => ({ ...b, [listeningFor]: e.key }));
      setListeningFor(null);
    };
    window.addEventListener('keydown', handler, true);
    return () => window.removeEventListener('keydown', handler, true);
  }, [listeningFor]);

  const display = renderBoard(board, shape, pos.x, pos.y, over);
  const usingMine = binds === MY_BINDS;

  const BIND_LABELS: [keyof Binds, string][] = [
    ['left','move left'],['right','move right'],['softDrop','soft drop'],
    ['hardDrop','hard drop'],['rotateCW','rotate cw'],['rotateCCW','rotate ccw'],
    ['rotate180','rotate 180'],['hold','hold'],['reset','reset'],['exit','back to portrait'],
  ];
  const keyLabel = (k: string | null) => {
    if (!k) return '—';
    const m: Record<string, string> = { ' ': 'space', ArrowLeft: '←', ArrowRight: '→', ArrowDown: '↓', ArrowUp: '↑', Escape: 'esc' };
    return m[k] ?? k;
  };
  const openSettings = () => {
    setPendingBinds({ ...binds }); setPendingDas(das); setPendingArr(arr); setPendingSdf(sdf);
    setShowSettings(true);
  };
  const saveSettings = () => {
    setBinds(pendingBinds); setDas(pendingDas); setArr(pendingArr); setSdf(pendingSdf);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ binds: pendingBinds, das: pendingDas, arr: pendingArr, sdf: pendingSdf })); } catch {}
    setShowSettings(false);
  };
  const BTN: React.CSSProperties = { background: 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none', fontFamily: 'inherit', cursor: 'pointer', padding: 0, fontStyle: 'normal' };

  const renderMini = (type: number): string => {
    const s = PIECES[type];
    const rows = s.filter(row => row.some(c => c));
    const WIDTH = 8; // 4 cols × 2 chars
    const lines = rows.map(row => {
      const rendered = row.map(c => c ? '[]' : '  ').join('');
      return rendered.padStart(WIDTH);
    });
    return lines.join('\n');
  };

  const INPUT_STYLE: React.CSSProperties = { width: '48px', background: 'none', border: 'none', borderBottom: '1px solid #333', color: '#888', fontFamily: 'inherit', fontSize: '11px', textAlign: 'center', outline: 'none', MozAppearance: 'textfield' };

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '0.5rem', userSelect: 'none', width: '100%', height: '100%', justifyContent: 'center', fontFamily: "'Menlo', 'Monaco', 'Courier New', monospace" }}>
      {/* Game board — always rendered */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
        <div style={{ position: 'relative' }}>
          <pre style={{ fontSize: '13px', lineHeight: '1.2', margin: 0, color: '#d4d4cc' }}>
            {display}
          </pre>
          {over && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,10,10,0.88)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', zIndex: 5 }}>
              <span style={{ fontSize: '12px', color: '#e8e8e0' }}>game over</span>
              <span style={{ fontSize: '11px', color: '#555' }}>press <strong style={{ color: '#888' }}>r</strong> to restart</span>
            </div>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingTop: '15.6px', paddingBottom: '15.6px', alignSelf: 'stretch' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {queue.map((type, i) => (
              <pre key={i} style={{ fontSize: '13px', lineHeight: '1.2', margin: 0, color: i === 0 ? '#d4d4cc' : '#555' }}>
                {renderMini(type)}
              </pre>
            ))}
          </div>
          {held != null
            ? <pre style={{ fontSize: '13px', lineHeight: '1.2', margin: 0, color: canHold ? '#d4d4cc' : '#555' }}>{renderMini(held)}</pre>
            : <pre style={{ fontSize: '13px', lineHeight: '1.2', margin: 0, color: '#333' }}>{'  '.repeat(4)}</pre>
          }
        </div>
      </div>
      <div style={{ fontSize: '12px', color: '#888', display: 'flex', gap: '1.5rem' }}>
        <button tabIndex={-1} onClick={openSettings} className="game-link" style={{ ...BTN, fontSize: '12px', color: '#555' }}>settings</button>
        <span>lines: {lines}</span>
      </div>
      <div style={{ fontSize: '11px', color: '#333' }}>{'// sorry no t-spins or any spins atm'}</div>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <button tabIndex={-1} onClick={onExit} className="game-link" style={{ ...BTN, fontSize: '11px', color: '#555' }}>
          ← back to portrait
        </button>
      </div>

      {/* Settings modal overlay */}
      {showSettings && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,10,10,0.93)', border: '0.5px solid rgba(232,232,224,0.15)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '1rem', zIndex: 10 }}>
          <div style={{ fontSize: '13px', lineHeight: '1.6' }}>
            {BIND_LABELS.map(([key, label]) => (
              <div key={key} style={{ display: 'flex', justifyContent: 'space-between', gap: '2rem' }}>
                <span style={{ color: '#555' }}>{label}</span>
                <button onClick={() => setListeningFor(key)} style={{ ...BTN, fontSize: '13px', color: listeningFor === key ? '#e8e8e0' : '#888', borderBottom: `0.5px solid ${listeningFor === key ? '#e8e8e0' : '#333'}` }}>
                  {listeningFor === key ? '...' : keyLabel(pendingBinds[key])}
                </button>
              </div>
            ))}
            <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
              <label style={{ fontSize: '11px', color: '#555', display: 'flex', alignItems: 'center', gap: '6px' }}>
                das <input tabIndex={-1} type="number" min={0} max={500} value={pendingDas} onChange={e => setPendingDas(Number(e.target.value))} style={INPUT_STYLE} onWheel={e => e.currentTarget.blur()} /> ms
              </label>
              <label style={{ fontSize: '11px', color: '#555', display: 'flex', alignItems: 'center', gap: '6px' }}>
                arr <input tabIndex={-1} type="number" min={0} max={500} value={pendingArr} onChange={e => setPendingArr(Number(e.target.value))} style={INPUT_STYLE} onWheel={e => e.currentTarget.blur()} /> ms
              </label>
              <label style={{ fontSize: '11px', color: '#555', display: 'flex', alignItems: 'center', gap: '6px' }}>
                sdf <input tabIndex={-1} type="number" min={0} max={500} value={pendingSdf} onChange={e => setPendingSdf(Number(e.target.value))} style={INPUT_STYLE} onWheel={e => e.currentTarget.blur()} /> ms
              </label>
            </div>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
              <button onClick={() => { setPendingBinds({ ...MY_BINDS }); setPendingDas(90); setPendingArr(10); setPendingSdf(10); }} className="game-link" style={{ ...BTN, fontSize: '11px', color: '#555' }}>use my keybinds</button>
              <button onClick={() => { setPendingBinds({ ...DEFAULT_BINDS }); setPendingDas(167); setPendingArr(33); setPendingSdf(33); }} className="game-link" style={{ ...BTN, fontSize: '11px', color: '#555' }}>reset</button>
              <button onClick={saveSettings} className="game-link" style={{ ...BTN, fontSize: '11px', color: '#555' }}>save & close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Portrait section ──────────────────────────────────────────────────────────

const ASCII_PORTRAIT = `xXxx+;+;++++xxxxxXXXXX+++++++XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX+XXXxXxxx++xXxXXXXXxx+++;++;;;;;;+xxXxx+xxxXxxXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx+xxXXXXX
XxXx+;;++++++xxxxXXXXX+++++++XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXxxxXxxXx+++xxxXxxXXXxx++++;;;:::;;;xxx++++;;++xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx+xXXXXX
XXXx+;;++++++xxxXXXXXX+++++++XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx++xxX++xxxx++;+;;;;:::;+XXXX++::;+x++xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx+xXXXXX
XXXx+++++++++xxxXXXXXX+++++++XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXxXxxXXx++++Xxx+++;;;;;:::;xXXX+++;;+xx++++XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx+xXXXXX
XXXx++++++++xxxxXXXXXX+++++++XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXxxxxx++xXX+++xXXx++++;;;;:::;+xxx++x+xXx++;+++XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx+xXXXXX
XXXx++++++++xxxxXXXXXX++++++xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx++++++;+XXXXXXXXx+++++++;;:::;;++;;++++++;;++++XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX+xxXXXXX
XXXx++++++++xxxxXXXXXx++++++xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXxXXXXx++++xXXXxxXXXXXx+xxxxx+;;::::::;++++++;;+;+++xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx++xXXXXX
XXX+++++++++xxxxXXXXXxx+++++xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx+xXXXXXXXXxxxx+xXXXXxx++;+x+++x+;;;;+++++;;;;;+++++XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx++xXXXXX
XXX+++++++++xxxxXXXXXx++++++XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX+++xXXXXx++++++xXXXXxx++;++;;;+++++++++;;;;;;;+;+++xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx+xxXXXXX
XXX+++++++++xxxxXXXXXx++++++XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx;++XXx++++xxxXXXXXXx+++;;;;;++++++;;;;;;;;;;;+;+XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx+xXXXXXX
XXX+++++++++xxxxXXXXXxx+++++XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX+;+XXx++xXXXXXXXXXxx++++;;;;+++;;;;;;;;;;;+;++xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx+xXXXXXX
XXx+++++++++xxxXXXXXXx++++++XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx+xXXXXXXXXXXXXXXxx++++++;;++;;;;;;;;;;;;+++xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx+xXXXXXXX
XXx++++++++xxxxXXXXXXxx+++++XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXxx+++++++++;;;;;;;;;;;+;++xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx+xXXXXXXX
XXx++++++++xxxxXXXXXXx++++++XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXxx++x++xx++;;;;;;;;;;+++++XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx+xXXXXXX
XXx++++++++xxxxXXXXXXxx+++++XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX+x+x+x++x+;;;;;;;;;+xXXxXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX+xxXXXXXX
XXx++++++++xxxxXXXXXXx++++++XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXxx+x+++xx+;;;;;;;;++XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXxxXXXXXXX
XX+++++++++xxxxXXXXXXxx+++++XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx++x+x+x+;;;;;;;;++XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx+xXXXXXXX
XX+++++++++xxxxXXXXXXx++++++XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx++x++xx+;;;;++++XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx+xXXXXXXX
Xx+++++++++xxxxXXXXXXx++++++XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX++x+x+x++;;+;+xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx+xXXXXXXX
Xx+;+++++++xxxxXXXXXXx+++++xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx++x+xx++;;;+xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx+xXXXXXXX
Xx++;++++++xxxxXXXXXxx+++++xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXxxxxXXXXXXXXXXXXxxXx+:::;:        :::::.::.   .:;xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX++xXXXXXXX
Xx+++++++++xxxxXXXXXxx+++++xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx+++++++;;;;;;;:::::::......                                         ;XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx++xXXXXXXX
Xx++++++++xxxxxXXXXXx++++++xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX+;.                                                                          .xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXxx+++XXXXXXX
Xx++++++++xxxxxXXXXXxx+++++xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX+.                                                                             +XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXxxxxxx+++xXXXXXXXX
Xx++++++++xxxxxXXXXXxx+++++xXXXXXXXXXXXXxxxxxXXXXXXXXXXXXXXXXXXXX                                                                              :xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXxxxxxxxxxx+++++XXXXXXXXXXX
Xx++++++++xxxxxXXXXXxx+++++xXXXXXXXXXXXXXx++++++++xxxxxXXXXXXXXX:                                                                              ++xxXXXXXXXXXXXXXXXXXxxxXxxxxxxxxxx+++++++++++XXXXXXXXXXXX
Xx++++++++xxxxxXXXXXx++++++xXXXXXXXXXXXXXXXXx+++;+;++++++++++xx;                                                                             .+xxxxXXXXXXXXXXXXXXXXXxxx+++++++++++++++++xxXXXXXXXXXXXXXXX
Xx++++++++xxxxxXXXXXxx+++++XXXXXXXXXXXXXXXXXXXXXXXxx++++;++++xx                                                                              xXXXXXXXXXXXXXXXXXXXXXXXXXXXx++++++++xxXXXXXXXXXXXXXXXXXXXXX
X+++++++++xxxxXXXXXXx++++++XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX:                                                                             xxXXXXXXXXXXXXXXXXXXXXXXXXXXXXXxxXXXXXXXXXXXXXXXXXXXXXXXXXXXX
X+++++++++xxxxxXXXXXx++++++XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX+                                                                             xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXxXXXXXXXXXXXXXXXXXXXXXXXXXXXX
X+++++++++xxxxXXXXXXx++++++XXXXXXXXXXXXXXXXXXXXXxXXXXXXXXXXXX                                                                             +xxxxxxXXXXXXXXXXXXXXXXXXXXXXXXXXxxxxXXXXXXXXXXXXXXXXXXXXXXXXXX
X+++++++++xxxxXXXXXXx++++++XXXXXXXXXXXXXXXXXXXXx+xXXXXXXXXXX;                                                                            +XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx+xXXXXXXXXXXXXXXXXXXXXXXXXXX
X+++++++++xxxxXXXXXXx+++++xXXXXXXXXXXXXXXXXXXXXX+xXXXXXXXXX+                                                                            ;xxxxxxxXXXXXXXXXXXXXXXXXXXXXXXXXXXXXxxXXXXXXXXXXXXXXXXXXXXXXXXXX
x+++++++++xxxxXXXXXXx+++++xXXXXXXXXXXXXXXXXXXXXXxxXXXXXXXXX:                                                                            ;++xxxXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXxxXXXXXXXXXXXXXXXXXXXXXXXXXX
X+;+++++++xxxxXXXXXX++++++++xXXXXXXXXXXXXXXXXXXXxxXXXXXXXx;                                                                           :.;;;+++++++xxxxxXXXXXXXXXXXXXXXXXXXXXXxxXXXXXXXXXXXXXXXXXXXXXXXXXX
x+;++++++xxxxxXXXXXXx++++++XxxXXXXXXXXXXXXXXxxxXxxXXXXX++;                                                                            ;:x++;;;;++++++++++++++++++++++++++++xxxxXXXXXXXXXXXXXXXXXXXXXXXXXx
x++++++++xxxxxXXXXXx+++++++XXXXXXXXXXXXxx++++++xXxXXXXx++:                                                                            :+xxxx++;;;;;;;;;;+++++++++++++++;++++XxxXXXXXx+++xxXXXXXXXXXXXxx++
x+;++++++xxxxxXXXXXx++++++xXXXXXXXXXXx++++++XXXXXxXXXXXx+                                                                             .:;;++xxx++;;;;;;;;+;++++++++++++xXXXXXxxXXXXXxxxx++xXXXXXXXXXXXx+x
x++++++++xxxxxXXXXXx++++++xXXXXXXXXx+++++xXXxxxxxXXXXXXx:                                                                                :;;++xxXXx+xxx+++xxxxxxXXXXXXXXxxXXXXXXXXXXXxXXx+++xxXXXXXXXXXXX
x++++++++xxxxxXXXXXx++++++xxxxxx+++++xXXXXXXxxXXXXxx+++;                                                                     .            .;;;++xXXXXXXXXXXXXXXXXXXXXXXXXXXx++++xXXXXxxXx+XXxx+xxxXXXXXXX
x++++++++++xxxXXXXXxx++++++++++++++xXXXXXXXXXXXx++;;;;;                                                                          .         :;;;++++xxXXXXXXXXXXXXXXXXXXXXXxxx++++++xXXXx++XXXXXx+++xXXXXX
+++++++++xxxxxXXXXXx++++++xXXXXXXXXXXXXXXXXXXx++++xxXX+                                                                           .         ;;;+xxXxxxXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXxxx++xXXXXXXXXXXXXXxx
+++++++++xxxxxXXXXXx++++++xXXXXXXXXXXXXXXXXXXXXXXXXXXX:                                                                            .         ::;+xxXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx+++
+++++++++xxxxxXXXXXx++++++xXXXXXXXXXXXXXXXXXXXXXXXXXXX           .::::                                                                         :;++++++xxxxxXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXxx
++++++++xxxxxxXXXXXx+++++xXXXXXXXXXXXXXXXXXXXXXXXXXXXXx;:;xxxxxxxxx++;                                                                          .:::;;;;;++++++++++xxxXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
++++++++xxxxxxXXXXX+xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXxxx++++;;;::.                                                                             ...::::::::;;;;;;;+++++++++xxxXXXXXXXXXXXXXXXXXXXXXXXXX
++++++++xxxxxxXXXXXXXXXXXXXXXXXXXXXXXXXXXx+XXXXXXxxx+++;;;;;:::::...                                                                              ;+;;;:::::::::::::::::;;;;;;++++++++xxxxXXXXXXXXXXXXXXX
++++++++xxXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXxx+++++;;;;;;:::::::...                                                                                  :+xxxxxxxxx++++;;;:::::::::::::::;;;;;;;;+++++xxxXXXXXXX
++;++xXXXXXXXXXXXXXXXXXXXXXXXXXXxx++++;;;:::::::::::.:..... .  ......                                      ..;+;.                                :++++++xxxxxxxxxxXxxxx++++;;;::::.:::::::;;;;;+++++++++x
++xXXXXXXXXXXXXXXXXXXXXXxxx+++;;;;;;::::::::..:...........:::;;;++++;:                                    .;;+xxxx++++;;;;:.                     .::::::;;;;;;++++++x+xxxxxxxxxXxx+++;;;:::::::::::;;;;;+
XXXXXXXXXXXXXXXXxx+++;;;;;::::::::::::.:.......::::;;;+++++++++++;:.                                   .;+++++xxxx++++++;;::.       ..        .++xxx+++++;;;;;:::;;;;;;+++++++xxxxxxxxxxxxxx+++;;;:::::::
XXXXXXXXxx++++;;;;;:::::::::..:.:...:::::;;;;+++++++++++;;;:::::..                                  ;;;+++++++++++++++++;;;;:::::::::::;:    .::;;;;++++++xxxxxxx+++;;;;:::;;;;;+++++++++xxxxxxXXXXxx+++;
XXx+++;;;;;:::::::.:........::::;;;+++++++++++;;;;:::::......::::..                               .:+++++++++++++++++++;;;;;::::++++;::;;:  :;;;;;;;;:::::;;;;;+++++xxxxxxx+++;;;;;::;;;;;;+++++++xxxxxxX
;;;;;::::::::.......:::::;;+++xx+++++;;;::::.......:::;;;++++++;;                   ;:. .       :::;+++++++++++++++++;;;;;;:::.:++;.   ...;;;;;;;;;;;;;+++;;;;;;:::::;;;;;++++xxxxxx+++;;::::::;;;;++++++
::::::.......::::;;;++++x++++;;;:::::.....::::;;+++++++;;;;::::.                     :;;;;:::. :;;;;;+++++x+x++++++++;++;;;::::;;:.       ++++++xxx++++;;;;;;;;;;+++++;;;;;::::;;;;+++++xxx+++;;;::::::;;
..:::::::;;+++++++++++;;;::::......:::;;+++++;;;;;::::::........                       :+++;;:.:;+;++++++x+++++++++++++++;;;;;;+++;;;:   ;+xxxxxxx+++++++xx+xx++++;;;;;;;;;+++++;;;::::::;;;+++++x+++++;;
::;;;++++++++;;;::::......::::;;;+++++;;;::::..::.::::..:........  .                     .:;:.::;+++++++++++++++++++++++;;;;;;;;;;;;;+;:::::;;;;;++++xxxxxxxx++++++++++x++++;;;;;;;;;;;;;;;:::::::;;;++++
++++++;;;:::::.....::;;;+++++;;;;:::::.::::::...:....::::::::::::                             .;;;++++++++++++++++++++++++;;;:::::::::.::::::::::::::;;;;;;;++++xxxxxxxx++++++x+x+++++;;;;;;;;+;;;;::::::
;;:::::....:::;;++++++;;;:::::.:.:::::.....:::::::::;;;;+++++x++:                             :+++++++++++++++++++++++++;;;::.          .:::::::::::::::::;:;:;;;;;;;;+++xxxXxxxxx++++++++++;;;;;:;;;;;;;
:...:::;;++++++;;;:::.:.:::::.......:::;;;;;;+;;+++xxxx+++;;;::::..                       .;;;+++;;+++++++++++++++;+;;;;:::...:;;;;;;:...:.:::::::::::::::::::::::::;;;;;;;;;;;++++x+xx++++++++++++++;;;:
:::;++++;;;::::..:::.:......:::::;;;++++++xxxx+++;;;:::::::.:.:....                      .;++++++;;;;;;;;;;;;;;;;;;;;::::.::::;;:::.....:.::::::::::::::::::::::::::::::::::;::;;;;::;;;;;++++x++++++++++
:::.:::::.:::.........:::::;;;+++xxxx+++;;;::::..:...:.............                  ::;++++++++++;;;:::::::;;;;;;;;:::::::::::::..     ..::::::::::::::::::::::::::::::::::::::::::::;:;:;:;:;;;;++++x++
..............::::::;;;+++xxx+++;;::::::::.................... .                      :++++++++++++;;;::...:::::::::::;;;;;;;;:::::.   .::::::::::::::::::::::::::::::::::::::::::::::::::::;:;;:;:;;;;;;
.    ..:::::::;;+++xx+++;;;:::::::.:............ .....                                 :+++++++++++;;;;:::.......:::::::;;;;;;;;;::::..:+Xxxxx++++;;;;;::::::::::::::::::::::::::::::::::::::::::;:::;:;;
......:::;++++++;;;::::.:..:................ .                                        .:;++++++++++++;;;;:::..     ...::::;;;;;;:::.. :;+xXXXXXXXXXXXXXxxx++++;;;;:::::::::::::::::::::::::::::::::::::::
...::.::::::::.:................... . .                          ..::;;;.             ;++x+++++++++++++++;;;;;::...      ....:::...      :::;;;;;;++++xxXXXXXXXXXXXXXxx++++;;;;;:::::::::::::::::::::::::
............................. .                        ...::;;;++xxxXXxx;:          ;;;+x+++++++++++++;;;;;:::..                      :+xxxx++++++;;;;;;;;++++xxXXXXXXXXXXXXxx+++;;;;;;;;;:;:::::::::::::
        ......... . .                         ....::;;++xxXXXXXxx+++;;;;::          ;+++xxx++++++++++++++;;;;::.                      :;++++xxxXXXXXXXxx++++;;;;;;;;+++xxXXXXXXXXXXXXXxxx++++;;;;;;:;::::
.                                   . ...::;;+++xxxXXXxx+++;;;;:::::;;;;+++         :++x++++++++++++++++++++;;::.                   .;+++;;;;;:;;;;;+++xxxXXXXXXXxx++++;;;;;;++++xXXXXXXXXXXXXXxx++++;;;;
..                          . ..:::;;++xxXXXxxxx++;;;;::::::;;;+++xxxx+++;;.       .;++x+++++++++++++++++++;;;;:.               ..:::;;;;++++xx+++++;;;;::;;;;+++xxxXXXXXXxx+++;;;;;;;+++xXXXXXXXXXXXXXXx
..                     ..::;;++xXXXXXxx+++;;;:::::::;;++++xxx+++;;;;::::::;;;      ;++x+++++++++++++++++++;;;;:.         :;+xxxxx++++;;;;;;::::;;;;++++xxx++++;;;;;;;;;;+++xxXXXXXXxx+++;;;;;;+++xxXXXXXX
 .                .:;++xxXXXXXxx++;;;:::::;;;+++xxx+++++;;:::::::;;;++++++;;;:.   ;+xx++++++++++++++++++;;;:::.      ...::;;;;;+++++xx+xxxxxxx++++;;;;;:;;;;;++++xxxx+++;;;;;;;;;+++xxxXXXXXxx+++;;;;;+++
..           ..::::+xXxx++;;;::::::;;+++xxx+++;;;::..::::;;;++++;;;;;:::::::;+XXXXXXXXxx+++++++++++++++++;::.       . .:    ......:::::;;;++++xxxxxXXxxx++++;;;;;;;;;;++++xxxx++++;;;;;;;++++xxXXXXXxx+++
       .. .::::::::::::::::;;;+++xx+++;;;:::::::;;;;;++;;;;:::::::::;;;+++++xXXX$$X$$$$XXXxx+++++++++++++;;;:.    . ....                ....:::::;;;;+++xxxxxXXXxxx+++;;;;;;;;;;++++xxxx+++;;;;;;;+++xxXX
  .................::::++x++++;;::::::::;;+++++;;;::.::::::;;;++++++++++;;;;XXXX$X$$$$$$$$X$XXx+++++++++++;;;:.. . . ...                           ....::::;;;;++++xxxXXXXxx+++;;;;;;;;;;+++xxxxx+++;;;;;
.......... ...::::::::::::::::::;;;+++;;;;:::::::::;;;++++++++;;;;;;;;++;::xXX$X$$$$$$$$$$$X$$XXXx++++++++;;::. .. .  ..:....                                ....::::;;;++++xxxxXXXxxx+++;;;;;;;;+++xxxxx
............:::.........::;++++;;;:::::::::;;++++++++;;;:::::::;;+++x++xx;+XXX$$$$$$X$$X$$$$X$$$XXXx++++;;::....... . . ..::;::::::::::.....                          ...::::::;;++++xxxXXXXxxx+++;;;;;;;
...........    ....:::::::::::::::;;;+++++++++++++;::::;:;;+xx++xxXXXXXXXXXXXXX$X$$$$$$$$$$$$$X$$XXXx+++;;:.....:....   .::;+;::;:::::::::::::::::...                          ..:::::;;;++++xxxxXXXxxx++
...       . ............::::;;+++++++++++;+;;;++++++++xxXXXXXXXXXXXXXXXXXXXXXXX$$X$$$$$$$X$$$$$$XX+    :;;:::.:::::::;+x+++;+;;:::::::.:.      ..:::....::::....                      ...:::::;;;++++xxxx
    ........ .......::::::::;;;;:;;;;+++xxxxXXXXxxxxxxx+xXXXXXXXXXXXXXXXXXXXXXXXX$$$X$$X$$$$X$$Xx        :.      :+XXXx++++;;+;::. .:::;;::...     :::....:::::.::::::::...                    ..:::::;;;
............. .::::::::.:......:;;+++xxXXXXXXXXXXXXXxxxx++xxXXXXXXXXXXXXXXXXXXXXXXXX$$$$$$$$$$X:                    .++++;;;;;+:.  :;;;;;;;;;;;.     ::....:::::.::::::::::::::....                    ..
.................... .     .:;;++xxxXXXXXXXXXXXXXxxxx+++++++++xxxxxXxxxxxxxXXXXXXXXXX$$$$$X$X+                        ;+;;;;;;;;  :;;;;;:;;;;;;::...        ..::::...::......::::::::::::...
.......... .               :;+xxxXXXXXXXXXx+++;;:                 .::::;::::;++++xXX$$$X$$$x:   ...                    ;++;;;;;;;:;+;:.    ::;;::::..         .::::. .......:......:::::::::::::::..
.                        :;++xxXXXXXxxx+:                                         .              :;+xXX+                ;++++;;;+;::        .:::;:;:..            ...  ....:.. ..:::::::::..    ..:::::::
                        ;++xxXXXXXxx+:                                                                 .:.               ;++++;:              :::;;;:.                  .  ..::::......              .:;:
                       ;;++xxxxXxx+:                                                      ::::..                                               ::;;;:....         .        .....::..                   .:
                     .;++xxxxxx+;                                                   :::::.                                                     ;++: .     ..:...   .:             .              .. .   .
                     :;+++xxx+:                                                     .XXXXXXXx+:.         .     :::                            :+++;:        :::..        ...                      ..:...
                   .;++xx++;                                                         ;XXXXXXXXXXXXX+;:.  .                        ::;++++                  .:::.... .       .                       :::..
                   :;++xx+:                                                           xXXXXXXXXXXXXXXXXX+;:                                                 :;:: ........ .                    .  ..:;;:.
                   :+xx;                                                              .XXXXXXXXXXXXXXXXXXXX+:                                                     ..  . ..                  .. ....::;;:.
                 .;+xx.                                                                ;XXXXXXXXXXXXXXXXXXx++:              ;;                                          .                         ..
                 :+++                                                                   +XXXXXXXXXXXXXXXXXx+x+              :xx+                                      ...                 ...    .
                :++;                                                                     xXXXXXXXXXXXXXXXX++++:              ;XX;                                                     .....     . .. ..
                :+:                                                                      ;XXXXXXXXXXXXXXXX+;++;               +Xx:                                                    .:...         .   .
               :;.                                                                       :XXXXXXXXXXXXXXXx++XX+.              :XX+.                                                  ::::.   .       .
                                                                                          +XXXXXXXXXXXXXXxxXXXx:               +Xx;                                                 .:::              ..
                                                                                          ;XXXXXXXXXXXXXXxxXXXx:               :xXx;                                          ..    .:;:              ..
.                                                                                         :XXXXXXXXXXXXXXXXXXXx:                +XX+:                                          .     ::.              .:.
        .:::.                                                                              +XXXXXXXXXXXXXXXXXXX;                :XXX+                                               .::.               :.
    ... ..:.                                                                               +XXXXXXXXXXXXXXXXXXX+                .+XXx;                                               ::.               ::
  ..::...::                                                                                +XXXXXXXXXXXXXXXXXXX+.                +XXXx.                                              :.                ::
  .:::..::                                                                                 ;XXXXXXXXXXXXXXXxxXX+.                :XXXx;                                              ..                ::
...:::.::.                                                                                 ;XXXXXXXXXXXXxx++xXXx:                 xXXX+:                                             ..                .:
..::. .:.                                                                                  ;XXXXXXXXXXXxx++xXXXX:                 +XXXx+                                             ..                .:
:;:..                                                                                      ;XXXXXXXXXxx+++xXXXXx:                 :XXXXx:                                            ..                .:
   ....                                                                                    ;XXXXXXXXxx+++xXXXXX+.                  +XXXx+                                             .                 :
    ..                                                                                     ;XXXXXXXxx++++XXXXXX;.                  ;XXXxx;                                                              :
   .                                                                                       ;XXXXXXXxx+++xXXXXXx;.                  .xXXxx+                                                              .
.                                                                                          +XXXXXXxx+++xXXX$XX+;:                   ;XXxxx:                                                             .`;

export default function PortraitSection() {
  const [playing, setPlaying] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <div className="portrait-wrap" style={{ flex: '0 0 auto', position: 'relative' }}>
      {/* Portrait — always rendered to hold container size, invisible when playing */}
      <div style={{ visibility: playing ? 'hidden' : 'visible' }}>
        <pre
          style={{
            fontSize: 'clamp(1.8px, 0.49vw, 3px)',
            lineHeight: '1.15',
            letterSpacing: '0px',
            margin: 0,
            color: '#d4d4cc',
            whiteSpace: 'pre',
            userSelect: 'none',
          }}
        >
          {ASCII_PORTRAIT}
        </pre>
        {isMobile ? (
          <span style={{ fontFamily: "'Menlo', 'Monaco', 'Courier New', monospace", fontSize: 'clamp(8px, 2vw, 13px)', color: '#444', fontStyle: 'normal', paddingTop: '6px', display: 'block' }}>
            view on desktop to play tetris
          </span>
        ) : (
          <button
            onClick={() => setPlaying(true)}
            className="game-link"
            style={{
              background: 'none',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              color: '#444',
              fontFamily: "'Menlo', 'Monaco', 'Courier New', monospace",
              fontSize: '11px',
              cursor: 'pointer',
              fontStyle: 'normal',
              padding: '6px 0 0 0',
              display: 'block',
            }}
          >
            click here to play tetris
          </button>
        )}
      </div>

      {/* Tetris — absolutely fills the same space as the portrait */}
      {!isMobile && playing && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
          <TetrisGame onExit={() => setPlaying(false)} />
        </div>
      )}
    </div>
  );
}
