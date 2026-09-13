'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Gamepad2, RotateCcw, Search } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

type GamepadSnapshot = { id: string; index: number; buttons: number[]; axes: number[]; timestamp: number };

function snapshot(gamepad: Gamepad): GamepadSnapshot {
  return {
    id: gamepad.id.slice(0, 160),
    index: gamepad.index,
    buttons: gamepad.buttons.map((button) => button.value),
    axes: [...gamepad.axes],
    timestamp: gamepad.timestamp
  };
}

export default function GamepadTester() {
  const [supported, setSupported] = useState(true);
  const [controller, setController] = useState<GamepadSnapshot | null>(null);
  const [baseline, setBaseline] = useState<number[]>([]);
  const [scanning, setScanning] = useState(false);
  const foundTracked = useRef(false);

  const scan = useCallback(() => {
    if (!('getGamepads' in navigator)) { setSupported(false); return; }
    const pad = [...navigator.getGamepads()].find((candidate): candidate is Gamepad => Boolean(candidate?.connected));
    setController(pad ? snapshot(pad) : null);
    if (pad && !foundTracked.current) {
      foundTracked.current = true;
      trackEvent('tool_complete', { tool_id: 'gamepad-tester' });
    }
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => setSupported('getGamepads' in navigator), 0);
    const connect = () => { setScanning(true); scan(); };
    const disconnect = () => scan();
    window.addEventListener('gamepadconnected', connect);
    window.addEventListener('gamepaddisconnected', disconnect);
    return () => {
      window.removeEventListener('gamepadconnected', connect);
      window.removeEventListener('gamepaddisconnected', disconnect);
      window.clearTimeout(timeout);
    };
  }, [scan]);

  useEffect(() => {
    if (!scanning) return;
    let frame = 0;
    const update = () => { scan(); frame = window.requestAnimationFrame(update); };
    frame = window.requestAnimationFrame(update);
    return () => window.cancelAnimationFrame(frame);
  }, [scan, scanning]);

  const axes = controller?.axes || [];
  const adjustedAxes = axes.map((value, index) => value - (baseline[index] || 0));
  const leftX = adjustedAxes[0] || 0;
  const leftY = adjustedAxes[1] || 0;
  const rightX = adjustedAxes[2] || 0;
  const rightY = adjustedAxes[3] || 0;
  const centreMovement = adjustedAxes.length ? Math.max(...adjustedAxes.map(Math.abs)) : 0;

  return (
    <div className="tool-surface gamepad-tool">
      {!supported ? <div className="tool-notice" role="status"><Gamepad2 aria-hidden="true" /><div><strong>Gamepad API unavailable</strong><p>This browser does not expose the standard Gamepad API. Try a current desktop browser and connect the controller before opening the tester.</p></div></div> : (
        <>
          <div className="tool-toolbar">
            <div><strong>{controller ? 'Controller detected' : 'Waiting for a controller'}</strong><span>Connect by USB or Bluetooth, then press a controller button.</span></div>
            <button type="button" className="cta-button" onClick={() => { setScanning(true); scan(); trackEvent('tool_start', { tool_id: 'gamepad-tester' }); }}><Search size={18} aria-hidden="true" /> Scan</button>
          </div>
          {controller ? (
            <>
              <div className="gamepad-identity"><span>Controller {controller.index + 1}</span><strong>{controller.id}</strong></div>
              <div className="stick-grid" aria-label="Live analog stick positions">
                {[['Left stick', leftX, leftY], ['Right stick', rightX, rightY]].map(([name, x, y]) => (
                  <div className="stick-readout" key={String(name)}><strong>{name}</strong><div className="stick-field"><span style={{ transform: `translate(calc(-50% + ${Number(x) * 42}px), calc(-50% + ${Number(y) * 42}px))` }} /></div><small>X {Number(x).toFixed(3)} · Y {Number(y).toFixed(3)}</small></div>
                ))}
              </div>
              <div className="gamepad-buttons" aria-label="Controller button values">
                {controller.buttons.map((value, index) => <div key={index} className={value > 0.1 ? 'is-active' : ''}><strong>{index}</strong><span>{value.toFixed(2)}</span></div>)}
              </div>
              <div className="axis-list"><h3>All axes</h3>{adjustedAxes.map((value, index) => <div key={index}><span>Axis {index}</span><meter min="-1" max="1" value={value}>{value.toFixed(3)}</meter><strong>{value.toFixed(3)}</strong></div>)}</div>
              <div className="tool-notice" role="status"><Gamepad2 aria-hidden="true" /><div><strong>Centre movement: {centreMovement.toFixed(3)}</strong><p>Movement near the centre may indicate drift, calibration differences or controller/browser behaviour. This reading alone cannot confirm a hardware fault.</p></div></div>
              <button type="button" className="secondary-button" onClick={() => { setBaseline([...axes]); trackEvent('tool_retry', { tool_id: 'gamepad-tester' }); }}><RotateCcw size={18} aria-hidden="true" /> Set current position as baseline</button>
            </>
          ) : <div className="gamepad-empty" role="status"><Gamepad2 size={54} aria-hidden="true" /><strong>No controller detected yet</strong><p>Some browsers reveal a gamepad only after you press one of its buttons while this page is open.</p></div>}
        </>
      )}
    </div>
  );
}
