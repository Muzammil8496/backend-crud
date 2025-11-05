const http = require('http');
const url = require('url');
const connectDB = require('./src/config/db');
const productRoutes = require('./src/routes/productRoutes');

// ✅ Connect Local MongoDB (Compass)
connectDB();

// Create Server
const server = http.createServer((req, res) => {
  const { pathname } = url.parse(req.url, true);

  // ✅ Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  // ✅ Handle routes
  productRoutes(req, res, pathname);
});

// Start Server
const PORT = 4000;
server.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
