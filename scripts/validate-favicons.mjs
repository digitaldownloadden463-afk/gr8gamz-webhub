import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];
const pngRequirements = new Map([
  ['public/favicon-48x48.png', 48],
  ['public/favicon-96x96.png', 96],
  ['public/apple-touch-icon.png', 180],
  ['public/android-chrome-192x192.png', 192],
  ['public/android-chrome-512x512.png', 512],
  ['public/icon.png', 512]
]);

function readRequired(relativePath) {
  const absolutePath = path.join(root, relativePath);
  if (!fs.existsSync(absolutePath)) {
    failures.push(`Missing required favicon asset: ${relativePath}`);
    return null;
  }
  return fs.readFileSync(absolutePath);
}

function pngDimensions(buffer, relativePath) {
  const signature = '89504e470d0a1a0a';
  if (!buffer || buffer.length < 24 || buffer.subarray(0, 8).toString('hex') !== signature) {
    failures.push(`${relativePath} is not a valid PNG`);
    return null;
  }
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

for (const [relativePath, expectedSize] of pngRequirements) {
  const dimensions = pngDimensions(readRequired(relativePath), relativePath);
  if (!dimensions) continue;
  if (dimensions.width !== dimensions.height) {
    failures.push(`${relativePath} is not square: ${dimensions.width}x${dimensions.height}`);
  }
  if (dimensions.width !== expectedSize || dimensions.height !== expectedSize) {
    failures.push(`${relativePath} must be ${expectedSize}x${expectedSize}, found ${dimensions.width}x${dimensions.height}`);
  }
}

const icoPath = 'public/favicon.ico';
const ico = readRequired(icoPath);
if (ico) {
  if (ico.length < 6 || ico.readUInt16LE(0) !== 0 || ico.readUInt16LE(2) !== 1) {
    failures.push(`${icoPath} is not a valid ICO`);
  } else {
    const count = ico.readUInt16LE(4);
    if (ico.length < 6 + count * 16) {
      failures.push(`${icoPath} has a truncated directory`);
    } else {
      const sizes = new Set();
      for (let index = 0; index < count; index += 1) {
        const offset = 6 + index * 16;
        const width = ico[offset] || 256;
        const height = ico[offset + 1] || 256;
        if (width !== height) failures.push(`${icoPath} entry ${index + 1} is not square: ${width}x${height}`);
        sizes.add(width);
      }
      for (const requiredSize of [48, 96, 192]) {
        if (!sizes.has(requiredSize)) failures.push(`${icoPath} is missing a ${requiredSize}x${requiredSize} entry`);
      }
    }
  }
}

const layoutPath = path.join(root, 'app/layout.tsx');
const layout = fs.readFileSync(layoutPath, 'utf8');
const expectedDeclarations = [
  "{ url: '/favicon-96x96.png', type: 'image/png', sizes: '96x96' }",
  "{ url: '/favicon.ico', type: 'image/x-icon', sizes: '48x48 96x96 192x192' }",
  "{ url: '/icon.png', type: 'image/png', sizes: '512x512' }"
];
let previousIndex = -1;
for (const declaration of expectedDeclarations) {
  const declarationIndex = layout.indexOf(declaration);
  if (declarationIndex === -1) failures.push(`Missing or incorrect root metadata declaration: ${declaration}`);
  if (declarationIndex !== -1 && declarationIndex <= previousIndex) failures.push('Root favicon metadata is not ordered 96px PNG, ICO, then 512px PNG');
  previousIndex = declarationIndex;
}
if (!layout.includes("apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }]")) {
  failures.push('Apple touch icon metadata is missing or incorrect');
}

const iconArrayStart = layout.indexOf('icon: [');
const firstIcon = layout.indexOf("url: '/favicon-96x96.png'", iconArrayStart);
const competingIcon = layout.indexOf("url: '/favicon.ico'", iconArrayStart);
if (iconArrayStart === -1 || firstIcon === -1 || (competingIcon !== -1 && firstIcon > competingIcon)) {
  failures.push('The 96x96 PNG must be the first primary favicon declaration');
}

const manifestPath = path.join(root, 'public/manifest.webmanifest');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const manifestIcons = [
  ...(Array.isArray(manifest.icons) ? manifest.icons : []),
  ...(Array.isArray(manifest.shortcuts) ? manifest.shortcuts.flatMap((shortcut) => shortcut.icons || []) : [])
];
for (const icon of manifestIcons) {
  if (typeof icon.src !== 'string' || !icon.src.startsWith('/')) {
    failures.push(`Manifest icon has an invalid src: ${String(icon.src)}`);
    continue;
  }
  const relativePath = `public${icon.src}`;
  const expectedSize = pngRequirements.get(relativePath);
  if (!expectedSize) {
    failures.push(`Manifest references an unsupported favicon asset: ${icon.src}`);
    continue;
  }
  if (icon.type !== 'image/png' || icon.sizes !== `${expectedSize}x${expectedSize}`) {
    failures.push(`Manifest metadata is incorrect for ${icon.src}`);
  }
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('Favicon validation passed: six square PNGs, ICO entries 48/96/192, ordered root metadata and valid manifest references.');
