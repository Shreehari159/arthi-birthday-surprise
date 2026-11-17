import { spawn, exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const backendDir = path.join(__dirname, 'backend');
const frontendDir = path.join(__dirname, 'frontend');

console.log('\n========================================================');
console.log('   🎉 Starting Birthday Surprise for Arthi 💙');
console.log('========================================================\n');

const isWin = process.platform === 'win32';
const npmCmd = isWin ? 'npm.cmd' : 'npm';

let backendProcess = null;
let frontendProcess = null;

function cleanup() {
  console.log('\nStopping servers...');
  if (backendProcess) {
    try {
      if (isWin) exec(`taskkill /pid ${backendProcess.pid} /t /f`);
      else backendProcess.kill('SIGTERM');
    } catch (e) {}
  }
  if (frontendProcess) {
    try {
      if (isWin) exec(`taskkill /pid ${frontendProcess.pid} /t /f`);
      else frontendProcess.kill('SIGTERM');
    } catch (e) {}
  }
  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

// 1. Start Backend
console.log('⏳ Starting Backend API on http://localhost:5000 ...');
backendProcess = spawn('node', ['server.js'], {
  cwd: backendDir,
  stdio: 'inherit',
  shell: true
});

backendProcess.on('error', (err) => {
  console.error('Failed to start backend:', err.message);
});

// 2. Start Frontend
console.log('⏳ Starting Frontend (Vite) on http://localhost:5173 ...');
frontendProcess = spawn(npmCmd, ['run', 'dev'], {
  cwd: frontendDir,
  stdio: 'inherit',
  shell: true
});

frontendProcess.on('error', (err) => {
  console.error('Failed to start frontend:', err.message);
});

// 3. Wait and open browser
let opened = false;
function checkAndOpenBrowser() {
  if (opened) return;
  const req = http.get('http://localhost:5173', (res) => {
    if (!opened) {
      opened = true;
      console.log('\n========================================================');
      console.log(' ✨ Birthday Surprise is LIVE and Running!');
      console.log(' 🌐 Access URL: http://localhost:5173');
      console.log(' 🌐 Backend / Fallback: http://localhost:5000');
      console.log(' 🔑 Secret Password: 181104');
      console.log('========================================================\n');
      console.log('🚀 Opening browser automatically...');
      const openCmd = isWin ? 'start http://localhost:5173' : (process.platform === 'darwin' ? 'open http://localhost:5173' : 'xdg-open http://localhost:5173');
      exec(openCmd);
    }
  });

  req.on('error', () => {
    setTimeout(checkAndOpenBrowser, 1000);
  });
}

setTimeout(checkAndOpenBrowser, 1500);
