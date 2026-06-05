'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

// ─── Tetris constants ──────────────────────────────────────────────────────────

const W = 10;
const H = 20;

const PIECES: number[][][] = [
  [[1, 1, 1, 1]],                         // I
  [[1, 1], [1, 1]],                        // O
  [[0, 1, 0], [1, 1, 1]],                  // T
  [[0, 1, 1], [1, 1, 0]],                  // S
  [[1, 1, 0], [0, 1, 1]],                  // Z
  [[1, 0, 0], [1, 1, 1]],                  // J
  [[0, 0, 1], [1, 1, 1]],                  // L
];

type Board = number[][];

function emptyBoard(): Board {
  return Array.from({ length: H }, () => Array(W).fill(0));
}

function randomPiece() {
  return PIECES[Math.floor(Math.random() * PIECES.length)];
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
  hold: null as string | null, reset: 'r',
};

const MY_BINDS = {
  left: 'l', right: "'",
  softDrop: ';', hardDrop: 'p',
  rotateCW: 'd', rotateCCW: 'a', rotate180: 's',
  hold: ' ', reset: 'r',
};

type Binds = typeof DEFAULT_BINDS;

// ─── Tetris component ──────────────────────────────────────────────────────────


function TetrisGame({ onExit }: { onExit: () => void }) {
  const [board, setBoard] = useState<Board>(emptyBoard);
  const [shape, setShape] = useState<number[][]>(() => randomPiece());
  const [pos, setPos] = useState({ x: 3, y: 0 });
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);
  const [lines, setLines] = useState(0);
  const [held, setHeld] = useState<number[][] | null>(null);
  const [canHold, setCanHold] = useState(true);
  const [binds, setBinds] = useState<Binds>(DEFAULT_BINDS);
  const [das, setDas] = useState(167);
  const [arr, setArr] = useState(33);
  const [sdf, setSdf] = useState(33);

  const stateRef = useRef({ board, shape, pos, over, held, canHold, binds });
  stateRef.current = { board, shape, pos, over, held, canHold, binds };
  const dasRef = useRef(das);
  const arrRef = useRef(arr);
  const sdfRef = useRef(sdf);
  dasRef.current = das;
  arrRef.current = arr;
  sdfRef.current = sdf;

  const dasTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const arrTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const sdfTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearMovement = useCallback(() => {
    if (dasTimer.current) clearTimeout(dasTimer.current);
    if (arrTimer.current) clearInterval(arrTimer.current);
  }, []);

  const clearSdf = useCallback(() => {
    if (sdfTimer.current) { clearInterval(sdfTimer.current); sdfTimer.current = null; }
  }, []);

  const spawn = useCallback((b: Board, nextShape?: number[][]) => {
    const s = nextShape ?? randomPiece();
    const p = { x: Math.floor((W - s[0].length) / 2), y: 0 };
    if (!fits(b, s, p.x, p.y)) { setOver(true); }
    else { setShape(s); setPos(p); setBoard(b); setCanHold(true); }
  }, []);

  const lock = useCallback((b: Board, s: number[][], p: { x: number; y: number }) => {
    clearSdf();
    const placed = place(b, s, p.x, p.y);
    const { board: cleared, lines: l } = clearLines(placed);
    setScore(sc => sc + l * 100 + 10);
    setLines(ln => ln + l);
    spawn(cleared);
  }, [spawn, clearSdf]);

  const drop = useCallback(() => {
    const { board: b, shape: s, pos: p, over: o } = stateRef.current;
    if (o) return;
    const ny = p.y + 1;
    if (fits(b, s, p.x, ny)) setPos({ x: p.x, y: ny });
    else lock(b, s, p);
  }, [lock]);

  const reset = useCallback(() => {
    clearMovement();
    setBoard(emptyBoard()); setShape(randomPiece()); setPos({ x: 3, y: 0 });
    setScore(0); setLines(0); setOver(false); setHeld(null); setCanHold(true);
  }, [clearMovement]);

  const startMoving = useCallback((dir: 'left' | 'right') => {
    const dx = dir === 'left' ? -1 : 1;
    const doMove = () => {
      const { board: b, shape: s, pos: p, over: o } = stateRef.current;
      if (o) return;
      if (arrRef.current === 0) {
        let nx = p.x;
        while (fits(b, s, nx + dx, p.y)) nx += dx;
        setPos({ x: nx, y: p.y });
      } else {
        if (fits(b, s, p.x + dx, p.y)) setPos(prev => ({ ...prev, x: prev.x + dx }));
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
    if (over) return;
    const speed = Math.max(150, 500 - Math.floor(lines / 5) * 50);
    const id = setInterval(drop, speed);
    return () => clearInterval(id);
  }, [drop, over, lines]);

  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      const { board: b, shape: s, pos: p, over: o, held: h, canHold: ch, binds: kb } = stateRef.current;
      if (e.key === 'Escape') { onExit(); return; }
      if (o) { if (e.key === kb.reset) reset(); return; }

      if (e.key === kb.left) { e.preventDefault(); startMoving('left'); }
      else if (e.key === kb.right) { e.preventDefault(); startMoving('right'); }
      else if (e.key === kb.rotateCW) {
        const r = rotateCW(s); if (fits(b, r, p.x, p.y)) setShape(r);
      } else if (kb.rotateCCW && e.key === kb.rotateCCW) {
        const r = rotateCCW(s); if (fits(b, r, p.x, p.y)) setShape(r);
      } else if (kb.rotate180 && e.key === kb.rotate180) {
        const r = rotate180(s); if (fits(b, r, p.x, p.y)) setShape(r);
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
        const next = h ?? randomPiece();
        setHeld(s);
        const sp = { x: Math.floor((W - next[0].length) / 2), y: 0 };
        if (!fits(b, next, sp.x, sp.y)) { setOver(true); return; }
        setShape(next); setPos(sp);
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

  const display = renderBoard(board, shape, pos.x, pos.y, over);
  const usingMine = binds === MY_BINDS;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', userSelect: 'none', width: '100%', height: '100%', justifyContent: 'center', fontFamily: "'Menlo', 'Monaco', 'Courier New', monospace" }}>
      <pre style={{ fontSize: '13px', lineHeight: '1.2', margin: 0, color: '#d4d4cc' }}>
        {display}
      </pre>
      <div style={{ fontSize: '12px', color: '#888', display: 'flex', gap: '1.5rem' }}>
        <span>score: {score}</span>
        <span>lines: {lines}</span>
        {held && <span>hold: ▪</span>}
      </div>
      {over && <div style={{ fontSize: '12px', color: '#e8e8e0' }}>game over — press <strong>r</strong> to restart</div>}
      <div style={{ fontSize: '11px', color: '#444', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {usingMine
          ? <><span>l/&apos; move</span><span>; soft</span><span>p hard</span><span>d/a/s rotate</span><span>space hold</span><span>r reset</span><span>esc exit</span></>
          : <><span>← → move</span><span>↓ soft</span><span>space hard</span><span>↑ rotate</span><span>r reset</span><span>esc exit</span></>
        }
      </div>
      {/* DAS / ARR inputs */}
      <div style={{ display: 'flex', gap: '1rem' }}>
        <label style={{ fontSize: '11px', color: '#555', display: 'flex', alignItems: 'center', gap: '6px' }}>
          das
          <input tabIndex={-1} type="number" min={0} max={500} value={das} onChange={e => setDas(Number(e.target.value))} style={{ width: '48px', background: 'none', border: 'none', borderBottom: '1px solid #333', color: '#888', fontFamily: 'inherit', fontSize: '11px', textAlign: 'center', outline: 'none', MozAppearance: 'textfield' }} onWheel={e => e.currentTarget.blur()} />
          ms
        </label>
        <label style={{ fontSize: '11px', color: '#555', display: 'flex', alignItems: 'center', gap: '6px' }}>
          arr
          <input tabIndex={-1} type="number" min={0} max={500} value={arr} onChange={e => setArr(Number(e.target.value))} style={{ width: '48px', background: 'none', border: 'none', borderBottom: '1px solid #333', color: '#888', fontFamily: 'inherit', fontSize: '11px', textAlign: 'center', outline: 'none', MozAppearance: 'textfield' }} onWheel={e => e.currentTarget.blur()} />
          ms
        </label>
        <label style={{ fontSize: '11px', color: '#555', display: 'flex', alignItems: 'center', gap: '6px' }}>
          sdf
          <input tabIndex={-1} type="number" min={0} max={500} value={sdf} onChange={e => setSdf(Number(e.target.value))} style={{ width: '48px', background: 'none', border: 'none', borderBottom: '1px solid #333', color: '#888', fontFamily: 'inherit', fontSize: '11px', textAlign: 'center', outline: 'none', MozAppearance: 'textfield' }} onWheel={e => e.currentTarget.blur()} />
          ms
        </label>
      </div>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <button tabIndex={-1} onClick={onExit} className="game-link" style={{ background: 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none', color: '#555', fontFamily: 'inherit', fontSize: '11px', cursor: 'pointer', padding: 0, fontStyle: 'normal' }}>
          ← back to portrait
        </button>
        <button tabIndex={-1} onClick={() => { if (usingMine) { setBinds(DEFAULT_BINDS); setDas(167); setArr(33); } else { setBinds(MY_BINDS); setDas(90); setArr(10); } }} className="game-link" style={{ background: 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none', color: '#555', fontFamily: 'inherit', fontSize: '11px', cursor: 'pointer', padding: 0, fontStyle: 'normal' }}>
          {usingMine ? 'use default' : 'use my keybinds'}
        </button>
      </div>
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
