import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { verifyPassword } from '../controllers/authController.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Endpoint for password login
router.post('/login', verifyPassword);

// Dynamic image discovery endpoint
router.get('/images', (req, res) => {
  const imagesDir = path.join(__dirname, '../../frontend/public/images');
  
  try {
    if (!fs.existsSync(imagesDir)) {
      return res.status(404).json({ error: 'Images directory not found' });
    }

    const files = fs.readdirSync(imagesDir);
    
    // Scan and filter for .jpg, .jpeg, .png, .webp (case-insensitive), excluding folders
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    const imageUrls = files
      .filter(file => {
        const fullPath = path.join(imagesDir, file);
        if (fs.statSync(fullPath).isDirectory()) return false;
        const ext = path.extname(file).toLowerCase();
        return imageExtensions.includes(ext);
      })
      .map(file => `/images/${file}`); // path relative to frontend public directory

    res.json({
      success: true,
      count: imageUrls.length,
      images: imageUrls
    });
  } catch (error) {
    console.error('Error reading images directory:', error);
    res.status(500).json({ error: 'Failed to read images folder' });
  }
});

// Dynamic video discovery endpoint
router.get('/videos', (req, res) => {
  const videosDir = path.join(__dirname, '../../frontend/public/videos');
  
  try {
    if (!fs.existsSync(videosDir)) {
      return res.json({ success: true, count: 0, videos: [] });
    }

    const files = fs.readdirSync(videosDir);
    const videoExtensions = ['.mp4', '.mov', '.webm', '.m4v'];
    const videoUrls = files
      .filter(file => {
        const fullPath = path.join(videosDir, file);
        if (fs.statSync(fullPath).isDirectory()) return false;
        const ext = path.extname(file).toLowerCase();
        return videoExtensions.includes(ext);
      })
      .map(file => `/videos/${file}`);

    res.json({
      success: true,
      count: videoUrls.length,
      videos: videoUrls
    });
  } catch (error) {
    console.error('Error reading videos directory:', error);
    res.status(500).json({ error: 'Failed to read videos folder' });
  }
});

export default router;
