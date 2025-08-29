import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/authRoutes.js';
import { connectDB } from './config/db.js';

// Import the required functions for ESM path handling
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
////

////
dotenv.config();
const app = express();

// Core
app.use(express.json());

// CORS
const allowedOrigin = process.env.CORS_ORIGIN || '*';
app.use(cors({ origin: allowedOrigin, credentials: true }));

// Rate limiting (global)
const limiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15*60*1000,
  max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
});
app.use(limiter);

// Health
app.get('/health', (req, res) => res.json({ ok: true }));
 app.use('/api/users', authRoutes); // This creates: /api/users/register
//app.use('/api/auth', authRoutes);

 
// ********************** SERVE STATIC FILES ********************** //
// Convert import.meta.url to __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define path to your frontend folder
// Since 'frontend' is a sibling of 'backend', we go up one level: '../frontend'
const frontendPath = join(__dirname, '..', 'frontend');

// Serve static files (CSS, JS, images, etc.)
app.use(express.static(frontendPath));

// Serve index.html for any other route (crucial for SPA routing)
app.get('*', (req, res) => {
  res.sendFile(join(frontendPath, 'index.html'));
});
// ********************** END STATIC FILES ********************** //




// Start
const PORT = process.env.PORT || 8000;
 console.log("API PORT on "+PORT);
connectDB().then(() => {
  app.listen(PORT, () => console.log(`API running on :${PORT}`));
});
