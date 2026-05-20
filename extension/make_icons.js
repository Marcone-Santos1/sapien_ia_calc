const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir);
}

// 1x1 PNG base64 em tom azul
const base64Png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
const imageBuffer = Buffer.from(base64Png, 'base64');

fs.writeFileSync(path.join(iconsDir, 'icon16.png'), imageBuffer);
fs.writeFileSync(path.join(iconsDir, 'icon48.png'), imageBuffer);
fs.writeFileSync(path.join(iconsDir, 'icon128.png'), imageBuffer);

console.log('Ícones criados com sucesso!');
