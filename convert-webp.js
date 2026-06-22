const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const dirs = [
  'Satellite Sequence 1',
  'Jet Sequence 1',
  'Land Sequence',
  'water sequence 1'
];

async function convertAll() {
  for (const d of dirs) {
    const dirPath = path.join(__dirname, 'public', d);
    if (!fs.existsSync(dirPath)) {
      console.log(`Skipping ${d}, not found.`);
      continue;
    }
    const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.png'));
    console.log(`Converting ${files.length} images in ${d}...`);
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      const p = path.join(dirPath, f);
      const out = path.join(dirPath, f.replace('.png', '.webp'));
      await sharp(p).webp({ quality: 80 }).toFile(out);
      fs.unlinkSync(p);
      if ((i + 1) % 50 === 0) {
        console.log(`  ... converted ${i + 1}/${files.length}`);
      }
    }
    console.log(`Done with ${d}`);
  }
}

convertAll().catch(console.error);
