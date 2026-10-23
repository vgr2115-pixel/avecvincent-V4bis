/* Regenerate the static PNG / ICO assets from the editable SVG sources.
   Requires sharp (available in the Codex workspace runtime). No build step on hosting. */
const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('sharp');
const root = path.resolve(__dirname, '..');
(async () => {
  const mark = await fs.readFile(path.join(root, 'favicon.svg'));
  for (const size of [16,32,48,96]) {
    await sharp(mark).resize(size,size).png().toFile(path.join(root,`favicon-${size}x${size}.png`));
  }
  const square = Buffer.from(mark.toString().replace('rx="14"','rx="0"'));
  for (const [name,size] of [['apple-touch-icon.png',180],['icon-192.png',192],['icon-512.png',512]]) {
    await sharp(square).resize(size,size).png().toFile(path.join(root,name));
  }
  // ICO with PNG frames: tiny browser tabs through higher-density displays.
  const sizes=[16,32,48,96];
  const frames=await Promise.all(sizes.map(s=>fs.readFile(path.join(root,`favicon-${s}x${s}.png`))));
  const header=Buffer.alloc(6+16*frames.length);header.writeUInt16LE(1,2);header.writeUInt16LE(frames.length,4);
  let offset=header.length;
  frames.forEach((frame,i)=>{const start=6+16*i;header[start]=sizes[i];header[start+1]=sizes[i];header.writeUInt16LE(1,start+4);header.writeUInt16LE(32,start+6);header.writeUInt32LE(frame.length,start+8);header.writeUInt32LE(offset,start+12);offset+=frame.length;});
  await fs.writeFile(path.join(root,'favicon.ico'),Buffer.concat([header,...frames]));
  for(const name of ['og-avec-vincent','og-cours','og-methode','og-contact','og-credit-impot','og-preview']) {
    await sharp(path.join(root,'images',`${name}.svg`)).png().toFile(path.join(root,'images',`${name}.png`));
  }
  // Stable branded URLs refresh old browser icons without changing the visual mark.
  for (const [source,target] of Object.entries({"favicon.svg": "avec-vincent-favicon.svg", "favicon-96x96.png": "avec-vincent-favicon.png", "apple-touch-icon.png": "avec-vincent-apple-touch-icon.png", "icon-192.png": "avec-vincent-icon-192.png", "icon-512.png": "avec-vincent-icon-512.png"})) {
    await fs.copyFile(path.join(root,source),path.join(root,target));
  }
  console.log('Generated browser / iPhone icons and six 1200×630 sharing images.');
})().catch(e=>{console.error(e);process.exit(1)});
