// Clear Vite cache and force rebuild
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧹 Clearing cache...\n');

// Clear Vite cache
const viteCachePath = path.join(__dirname, 'node_modules', '.vite');
if (fs.existsSync(viteCachePath)) {
  fs.rmSync(viteCachePath, { recursive: true, force: true });
  console.log('✅ Vite cache cleared');
}

// Clear dist
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  fs.rmSync(distPath, { recursive: true, force: true });
  console.log('✅ Dist folder cleared');
}

console.log('\n✅ Cache cleared successfully!');
console.log('📝 Next steps:');
console.log('   1. Run: npm run dev');
console.log('   2. Open browser in Incognito/Private mode');
console.log('   3. Go to: http://localhost:8080/create-place');
console.log('   4. Check if dropdown now shows "Kuliner" instead of "Restoran"\n');
