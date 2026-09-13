'use client';

import { useRef, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

const rows = [
  ['Escape', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'],
  ['Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Minus', 'Equal', 'Backspace'],
  ['Tab', 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight', 'Backslash'],
  ['CapsLock', 'KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote', 'Enter'],
  ['ShiftLeft', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 'Slash', 'ShiftRight'],
  ['ControlLeft', 'MetaLeft', 'AltLeft', 'Space', 'AltRight', 'MetaRight', 'ControlRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'ArrowRight']
];

const labels: Record<string, string> = {
  Backquote: '`', Backspace: 'Backspace', BracketLeft: '[', BracketRight: ']', Backslash: '\\',
  CapsLock: 'Caps', ControlLeft: 'Ctrl', ControlRight: 'Ctrl', ShiftLeft: 'Shift', ShiftRight: 'Shift',
  MetaLeft: 'Meta', MetaRight: 'Meta', AltLeft: 'Alt', AltRight: 'Alt', Semicolon: ';', Quote: "'",
  Comma: ',', Period: '.', Slash: '/', Space: 'Space', ArrowLeft: '←', ArrowUp: '↑', ArrowDown: '↓', ArrowRight: '→'
};

function keyLabel(code: string) {
  return labels[code] || code.replace(/^Key|^Digit/, '');
}

export default function KeyboardTester() {
  const [active, setActive] = useState<Set<string>>(new Set());
  const [tested, setTested] = useState<Set<string>>(new Set());
  const [last, setLast] = useState<{ key: string; code: string; location: number; repeat: boolean } | null>(null);
  const started = useRef(false);

  const reset = () => {
    setActive(new Set());
    setTested(new Set());
    setLast(null);
    started.current = false;
    trackEvent('tool_retry', { tool_id: 'keyboard-tester' });
  };

  return (
    <div className="tool-surface keyboard-tool">
      <div className="tool-toolbar">
        <div><strong>{tested.size}</strong><span>unique keys tested</span></div>
        <button type="button" className="secondary-button" onClick={reset}><RotateCcw size={18} aria-hidden="true" /> Reset</button>
      </div>
      <div
        className="keyboard-capture"
        tabIndex={0}
        role="application"
        aria-label="Keyboard test area. Focus here, then press keys to test them."
        onKeyDown={(event) => {
          if (event.code !== 'Tab') event.preventDefault();
          if (!started.current) {
            started.current = true;
            trackEvent('tool_start', { tool_id: 'keyboard-tester' });
          }
          setActive((current) => new Set(current).add(event.code));
          setTested((current) => new Set(current).add(event.code));
          setLast({ key: event.key, code: event.code, location: event.location, repeat: event.repeat });
        }}
        onKeyUp={(event) => setActive((current) => { const next = new Set(current); next.delete(event.code); return next; })}
        onBlur={() => setActive(new Set())}
      >
        <p className="keyboard-capture__prompt">Click or tab into this panel, then press a key. Tab remains available for keyboard navigation.</p>
        <div className="visual-keyboard" aria-hidden="true">
          {rows.map((row, rowIndex) => (
            <div className="visual-keyboard__row" key={rowIndex}>
              {row.map((code) => <span key={code} className={`${active.has(code) ? 'is-active' : ''} ${tested.has(code) ? 'is-tested' : ''}`} data-wide={/Space|Backspace|Enter|Shift/.test(code) || undefined}>{keyLabel(code)}</span>)}
            </div>
          ))}
        </div>
      </div>
      <div className="tool-results" aria-live="polite">
        <div><span>Last key</span><strong>{last?.key || 'None yet'}</strong></div>
        <div><span>KeyboardEvent.code</span><strong>{last?.code || '—'}</strong></div>
        <div><span>Location</span><strong>{last ? String(last.location) : '—'}</strong></div>
        <div><span>Repeat</span><strong>{last ? (last.repeat ? 'Yes' : 'No') : '—'}</strong></div>
      </div>
    </div>
  );
}
