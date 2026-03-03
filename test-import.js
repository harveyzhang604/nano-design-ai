const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, 'src');
console.log('Checking src directory:', srcPath);
console.log('Exists:', fs.existsSync(srcPath));

const files = [
  'config/templates.ts',
  'components/HistoryModal.tsx',
  'lib/history.ts'
];

files.forEach(file => {
  const fullPath = path.join(srcPath, file);
  console.log(`${file}: ${fs.existsSync(fullPath) ? '✓' : '✗'}`);
});
