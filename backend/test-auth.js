// Test Balance Sheet PDF generation (without auth for testing)
const auth = (req, res, next) => {
  req.user = { id: 'test-user', biz: 'test-biz' }; // Mock user for testing
  next();
};

module.exports = { auth };