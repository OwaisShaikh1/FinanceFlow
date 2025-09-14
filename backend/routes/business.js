// const express = require('express');
// const router = express.Router();
// const { Business } = require('../models');
// const jwt = require('jsonwebtoken');

// const ROLES = { CA: 'CA', OWNER: 'OWNER', EMPLOYEE: 'EMPLOYEE' };

// // inline auth middleware
// const auth = (req, res, next) => {
//   const hdr = req.headers.authorization || '';
//   const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : null;
//   if (!token) return res.status(401).json({ message: 'No token' });
//   try {
//     req.user = jwt.verify(token, process.env.JWT_SECRET);
//     next();
//   } catch {
//     return res.status(401).json({ message: 'Invalid/expired token' });
//   }
// };

// // inline role middleware
// const allow = (...roles) => (req, res, next) => {
//   if (!req.user || !roles.includes(req.user.role)) {
//     return res.status(403).json({ message: 'Forbidden' });
//   }
//   next();
// };

// // @desc   Create new business
// // @route  POST /business
// // @access CA, OWNER
// router.post('/', auth, allow(ROLES.CA, ROLES.OWNER), async (req, res) => {
//   try {
//     const biz = await Business.create({ ...req.body });
//     return res.status(201).json(biz);
//   } catch (err) {
//     return res.status(400).json({ message: err.message });
//   }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();

// In-memory "database"
let businesses = [];

// Example roles
const ROLES = { CA: 'CA', OWNER: 'OWNER', EMPLOYEE: 'EMPLOYEE' };

// Inline auth middleware (mock)
const auth = (req, res, next) => {
  // Just a mock user
  req.user = { id: 'user-1', role: ROLES.CA };
  next();
};

// Inline role-based access middleware
const allow = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
};

// Create new business
router.post('/', auth, allow(ROLES.CA, ROLES.OWNER), (req, res) => {
  const biz = {
    id: String(businesses.length + 1),
    ...req.body,
    assignedCA: null, // default
  };

  businesses.push(biz);
  return res.status(201).json(biz);
});

// Optional: list all businesses
router.get('/', auth, (req, res) => {
  return res.json(businesses);
});

module.exports = router;
