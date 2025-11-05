const Product = require('../models/Product');

async function getAllProducts() {
  return await Product.find();
}

async function addProduct(data) {
  const product = new Product(data);
  return await product.save();
}

async function updateProduct(id, data) {
  return await Product.findByIdAndUpdate(id, data, { new: true });
}

async function deleteProduct(id) {
  return await Product.findByIdAndDelete(id);
}

module.exports = {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
};
