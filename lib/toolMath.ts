export type SensitivityPreset = {
  id: string;
  name: string;
  degreesPerCount: number;
  source: string;
  sourceUrl: string;
};

// Each built-in value comes from the named project's published source code. The
// deliberately small list avoids guessing constants for closed game engines.
export const sensitivityPresets: SensitivityPreset[] = [
  {
    id: 'half-life-goldsrc',
    name: 'Half-Life / GoldSrc',
    degreesPerCount: 0.022,
    source: 'ValveSoftware/halflife cl_dll/inputw32.cpp (default m_yaw 0.022)',
    sourceUrl: 'https://github.com/ValveSoftware/halflife/blob/master/cl_dll/inputw32.cpp'
  },
  {
    id: 'quake-ii',
    name: 'Quake II',
    degreesPerCount: 0.022,
    source: 'id-Software/Quake-2 linux/rw_x11.c (default m_yaw 0.022)',
    sourceUrl: 'https://github.com/id-Software/Quake-2/blob/master/linux/rw_x11.c'
  },
  {
    id: 'doom-3-bfg',
    name: 'DOOM 3 BFG Edition',
    degreesPerCount: 0.022,
    source: 'id-Software/DOOM-3-BFG neo/framework/UsercmdGen.cpp (default m_yaw 0.022)',
    sourceUrl: 'https://github.com/id-Software/DOOM-3-BFG/blob/master/neo/framework/UsercmdGen.cpp'
  }
];

function positiveFinite(value: number) {
  return Number.isFinite(value) && value > 0;
}

export function calculateEdpi(dpi: number, sensitivity: number) {
  return positiveFinite(dpi) && positiveFinite(sensitivity) ? dpi * sensitivity : null;
}

export function calculateCmPer360(dpi: number, sensitivity: number, degreesPerCount: number) {
  if (![dpi, sensitivity, degreesPerCount].every(positiveFinite)) return null;
  return (360 * 2.54) / (dpi * sensitivity * degreesPerCount);
}

export function convertSensitivity(sensitivity: number, sourceDegreesPerCount: number, targetDegreesPerCount: number) {
  if (![sensitivity, sourceDegreesPerCount, targetDegreesPerCount].every(positiveFinite)) return null;
  return sensitivity * sourceDegreesPerCount / targetDegreesPerCount;
}
