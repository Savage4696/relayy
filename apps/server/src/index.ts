import { createServer } from './server.js';
import { CONFIG } from './config.js';

const app = createServer();

app.listen(CONFIG.PORT, () => {
  console.log(`====================================================`);
  console.log(` 🚀 RELAY Backend API Server running on port ${CONFIG.PORT}`);
  console.log(` 📍 Health Check: http://localhost:${CONFIG.PORT}/health`);
  console.log(` 📍 Active Context: http://localhost:${CONFIG.PORT}/api/context/active`);
  console.log(` 📍 Demo Mode: ${CONFIG.DEMO_MODE ? 'ENABLED' : 'DISABLED'}`);
  console.log(`====================================================`);
});
