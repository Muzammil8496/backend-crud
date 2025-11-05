const { getProducts, addProduct, updateProduct, deleteProduct } = require('../controllers/productController');

const productRoutes = (req, res, pathname) => {
  const pathParts = pathname.split('/').filter(Boolean); // e.g. ['products', '123']
  const basePath = `/${pathParts[0] || ''}`;

  if (basePath === '/products') {
    const id = pathParts[1]; // optional

    if (req.method === 'GET' && !id) return getProducts(req, res);
    if (req.method === 'POST' && !id) return addProduct(req, res);
    if (req.method === 'PUT' && id) return updateProduct(req, res, id);
    if (req.method === 'DELETE' && id) return deleteProduct(req, res, id);
  }

  // 404 for unknown routes
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Route not found' }));
};

module.exports = productRoutes;
