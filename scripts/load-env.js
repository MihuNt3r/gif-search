const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
const outPath = path.join(__dirname, '..', 'src', 'app', 'core', 'env.generated.ts');

let apiKey = '';
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  const match = content.match(/API_KEY\s*=\s*(.+)/);
  if (match) apiKey = match[1].trim();
}

const outDir = path.dirname(outPath);
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

fs.writeFileSync(
  outPath,
  `// Generated from .env - do not edit\n/** Giphy API key from .env */\nexport const GIPHY_API_KEY = ${JSON.stringify(apiKey)};\n`,
  'utf8'
);
