const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

// ===================== AUTHENTICATION =====================
const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role, biz: user.business }, process.env.JWT_SECRET, { expiresIn: '7d' });

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid/expired token' });
  }
};

const allow = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

// ===================== FILE UPLOAD =====================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const sanitized = file.originalname.replace(/\s+/g, '_');
    cb(null, `${timestamp}_${sanitized}`);
  },
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|xlsx|csv/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) return cb(null, true);
    cb(new Error('Invalid file type'));
  }
});

// ===================== ERROR HANDLING =====================
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({ 
      error: 'Validation Error', 
      details: Object.values(err.errors).map(e => e.message) 
    });
  }
  
  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid ID format' });
  }
  
  if (err.code === 11000) {
    return res.status(400).json({ error: 'Duplicate entry' });
  }
  
  res.status(500).json({ error: 'Internal server error' });
};

// ===================== RESPONSE HELPERS =====================
const sendSuccess = (res, data, message = 'Success') => {
  res.json({ success: true, message, data });
};

const sendError = (res, status, message) => {
  res.status(status).json({ success: false, error: message });
};

module.exports = {
  signToken,
  auth,
  allow,
  upload,
  errorHandler,
  sendSuccess,
  sendError
};