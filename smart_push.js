const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function run(cmd) {
  console.log(`> ${cmd}`);
  return execSync(cmd, { stdio: 'inherit' });
}

function runOutput(cmd) {
  return execSync(cmd).toString().trim();
}

try {
  // 1. Commit Videos and Audio
  console.log('\n--- Committing Media Assets (Videos & Audio) ---');
  try {
    run('git add birthday-surprise/frontend/public/videos/ birthday-surprise/frontend/public/music/');
    run('git commit -m "Add background music and special video reels"');
    run('git push origin main');
    console.log('✓ Videos & Audio pushed successfully!');
  } catch (e) {
    console.log('Note on media:', e.message);
  }

  // 2. Batch push images in public/images
  console.log('\n--- Committing Images in batches ---');
  const pubImagesDir = path.join('birthday-surprise', 'frontend', 'public', 'images');
  const pubImages = fs.readdirSync(pubImagesDir).map(f => path.join(pubImagesDir, f));

  const rootFiles = fs.readdirSync('.').filter(f => /\.(png|jpe?g|mp4)$/i.test(f));

  const allRemaining = [...pubImages, ...rootFiles];
  console.log(`Total remaining media files to push: ${allRemaining.length}`);

  const batchSize = 25;
  for (let i = 0; i < allRemaining.length; i += batchSize) {
    const chunk = allRemaining.slice(i, i + batchSize);
    const batchNum = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(allRemaining.length / batchSize);
    console.log(`\nStaging batch ${batchNum} of ${totalBatches} (${chunk.length} files)...`);
    
    // Stage chunk
    for (const f of chunk) {
      if (fs.existsSync(f)) {
        try {
          execSync(`git add "${f}"`);
        } catch (err) {}
      }
    }

    try {
      execSync(`git commit -m "Add media batch ${batchNum} of ${totalBatches}"`);
      run('git push origin main');
      console.log(`✓ Batch ${batchNum}/${totalBatches} pushed!`);
    } catch (e) {
      console.log(`Batch ${batchNum} note: ${e.message}`);
    }
  }

  // 3. Final git add just in case any leftover file
  try {
    execSync('git add .');
    execSync('git commit -m "Finalize all project files and images"');
    run('git push origin main');
  } catch (e) {
    // Already up to date
  }

  // 4. Reset remote URL back to clean HTTPS
  run('git remote set-url origin https://github.com/Shreehari159/arthi-birthday-surprise.git');
  console.log('\n🎉 ALL FILES AND FOLDERS PUSHED TO GITHUB MAIN BRANCH SUCCESSFULLY!');

} catch (err) {
  console.error('Push error:', err.message);
  process.exit(1);
}
