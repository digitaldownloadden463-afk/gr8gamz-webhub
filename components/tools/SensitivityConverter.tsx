'use client';

import { useMemo, useRef, useState } from 'react';
import { Calculator } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import { calculateCmPer360, calculateEdpi, convertSensitivity, sensitivityPresets } from '@/lib/toolMath';

function numberValue(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

export default function SensitivityConverter() {
  const [dpi, setDpi] = useState('800');
  const [sensitivity, setSensitivity] = useState('2');
  const [sourceId, setSourceId] = useState(sensitivityPresets[0].id);
  const [targetId, setTargetId] = useState(sensitivityPresets[1].id);
  const started = useRef(false);
  const source = sensitivityPresets.find((preset) => preset.id === sourceId)!;
  const target = sensitivityPresets.find((preset) => preset.id === targetId)!;
  const results = useMemo(() => {
    const dpiValue = numberValue(dpi);
    const sensitivityValue = numberValue(sensitivity);
    return {
      edpi: calculateEdpi(dpiValue, sensitivityValue),
      cm360: calculateCmPer360(dpiValue, sensitivityValue, source.degreesPerCount),
      converted: convertSensitivity(sensitivityValue, source.degreesPerCount, target.degreesPerCount)
    };
  }, [dpi, sensitivity, source, target]);

  const recordStart = () => {
    if (started.current) return;
    started.current = true;
    trackEvent('tool_start', { tool_id: 'sensitivity-converter' });
    trackEvent('tool_complete', { tool_id: 'sensitivity-converter' });
  };

  return (
    <div className="tool-surface sensitivity-tool">
      <form onSubmit={(event) => event.preventDefault()}>
        <label>Mouse DPI<input type="number" min="1" max="100000" step="1" inputMode="numeric" value={dpi} onChange={(event) => { setDpi(event.target.value); recordStart(); }} /></label>
        <label>Source sensitivity<input type="number" min="0.001" max="1000" step="0.001" inputMode="decimal" value={sensitivity} onChange={(event) => { setSensitivity(event.target.value); recordStart(); }} /></label>
        <label>Source game<select value={sourceId} onChange={(event) => { setSourceId(event.target.value); recordStart(); }}>{sensitivityPresets.map((preset) => <option key={preset.id} value={preset.id}>{preset.name}</option>)}</select></label>
        <label>Target game<select value={targetId} onChange={(event) => { setTargetId(event.target.value); recordStart(); }}>{sensitivityPresets.map((preset) => <option key={preset.id} value={preset.id}>{preset.name}</option>)}</select></label>
      </form>
      <div className="tool-results" aria-live="polite">
        <div><span>eDPI</span><strong>{results.edpi?.toLocaleString('en-GB', { maximumFractionDigits: 3 }) || '—'}</strong></div>
        <div><span>Source cm/360</span><strong>{results.cm360 ? `${results.cm360.toFixed(2)} cm` : '—'}</strong></div>
        <div><span>Target sensitivity</span><strong>{results.converted?.toFixed(4) || '—'}</strong></div>
      </div>
      <div className="tool-notice"><Calculator aria-hidden="true" /><div><strong>Verified presets only</strong><p>The initial presets use published engine source values. These three engines use the same default yaw scale, so their equivalent sensitivity number is unchanged. Acceleration, modified yaw settings, FOV and scoped input can still change how aiming feels.</p></div></div>
      <details><summary>Technical sources</summary><ul className="clean-list">{sensitivityPresets.map((preset) => <li key={preset.id}><strong>{preset.name}:</strong> <a href={preset.sourceUrl} target="_blank" rel="noopener noreferrer">{preset.source}</a></li>)}</ul></details>
    </div>
  );
}
