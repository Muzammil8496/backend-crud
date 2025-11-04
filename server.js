const http = require('http');
const mongoose = require('mongoose');
const url = require('url');

// MongoDB Atlas connection string
const mongoURI = 'mongodb+srv://muzammil:naeemfarooq@cluster0.5jkrrv2.mongodb.net/?appName=Cluster0';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Define a Product schema for MongoDB
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, default: '' },
});

const Product = mongoose.model('Product', productSchema);

// Create an HTTP server
const server = http.createServer((req, res) => {
  const { pathname } = url.parse(req.url, true);

  // ✅ CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  // ✅ GET all products
  if (pathname === '/products' && req.method === 'GET') {
    Product.find()
      .then((products) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(products));
      })
      .catch((err) => {
        console.error('Error fetching products:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Database query failed' }));
      });
  }

  // ✅ POST (Add Product)
  else if (pathname === '/products' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => (body += chunk.toString()));
    req.on('end', () => {
      try {
        const { name, price, description } = JSON.parse(body);
        if (!name || price == null) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'Name and price are required' }));
        }

        const newProduct = new Product({ name, price, description });
        newProduct.save()
          .then(() => {
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: '✅ Product added successfully' }));
          })
          .catch((err) => {
            console.error('Error saving product:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Failed to add product' }));
          });
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
  }

  // ✅ PUT (Update Product)
  else if (pathname.startsWith('/products/') && req.method === 'PUT') {
    const id = pathname.split('/')[2]; // Get product _id from the URL
    let body = '';
    req.on('data', chunk => (body += chunk.toString()));
    req.on('end', () => {
      try {
        const { name, price, description } = JSON.parse(body);
        Product.findByIdAndUpdate(id, { name, price, description }, { new: true })
          .then((updatedProduct) => {
            if (!updatedProduct) {
              res.writeHead(404, { 'Content-Type': 'application/json' });
              return res.end(JSON.stringify({ error: 'Product not found' }));
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: '✅ Product updated successfully' }));
          })
          .catch((err) => {
            console.error('Error updating product:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Failed to update product' }));
          });
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
  }

  // ✅ DELETE Product
  else if (pathname.startsWith('/products/') && req.method === 'DELETE') {
    const id = pathname.split('/')[2]; // Get product _id from the URL
    Product.findByIdAndDelete(id)
      .then((deletedProduct) => {
        if (!deletedProduct) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'Product not found' }));
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: '🗑️ Product deleted successfully' }));
      })
      .catch((err) => {
        console.error('Error deleting product:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to delete product' }));
      });
  }

  // ❌ Route Not Found
  else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});

// Start the server
server.listen(4002, () => console.log('🚀 Server running at http://localhost:4002'));
