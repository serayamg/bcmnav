const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('📦 Mempersiapkan paket deployment bcm-system-deploy.zip...');

const STAGING_DIR = path.join(__dirname, '..', '.deploy_staging');
const ZIP_FILE = path.join(__dirname, '..', 'bcm-system-deploy.zip');

// Bersihkan staging jika ada
if (fs.existsSync(STAGING_DIR)) {
  fs.rmSync(STAGING_DIR, { recursive: true, force: true });
}
fs.mkdirSync(STAGING_DIR, { recursive: true });

// Daftar item yang akan dimasukkan
const ITEMS_TO_COPY = [
  'src',
  'public',
  'prisma',
  'package.json',
  'package-lock.json',
  'next.config.mjs',
  'tsconfig.json',
  'tailwind.config.ts',
  'postcss.config.mjs',
  'ecosystem.config.js',
  'Dockerfile',
  'docker-compose.yml',
  '.dockerignore',
  '.gitignore',
  '.env.example',
  '.env',
  'PANDUAN_HOSTING.md',
];

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const file of fs.readdirSync(src)) {
      copyRecursive(path.join(src, file), path.join(dest, file));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

for (const item of ITEMS_TO_COPY) {
  const srcPath = path.join(__dirname, '..', item);
  const destPath = path.join(STAGING_DIR, item);
  if (fs.existsSync(srcPath)) {
    copyRecursive(srcPath, destPath);
  }
}

// Kompresi menggunakan tar / zip
console.log('🗜️  Mengompresi berkas...');
try {
  if (fs.existsSync(ZIP_FILE)) {
    fs.unlinkSync(ZIP_FILE);
  }
  // Gunakan PowerShell Compress-Archive pada isi folder staging
  execSync(`powershell -Command "Compress-Archive -Path '${STAGING_DIR}/*' -DestinationPath '${ZIP_FILE}' -Force"`, {
    stdio: 'inherit',
  });
  console.log('✅ bcm-system-deploy.zip berhasil dibuat!');
  const stats = fs.statSync(ZIP_FILE);
  console.log(`📊 Ukuran file: ${(stats.size / 1024).toFixed(2)} KB`);
} catch (err) {
  console.error('Gagal mengompresi:', err);
} finally {
  // Bersihkan staging
  if (fs.existsSync(STAGING_DIR)) {
    fs.rmSync(STAGING_DIR, { recursive: true, force: true });
  }
}
