const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { signToken, sendSuccess, sendError } = require('../utils/middleware');

const router = express.Router();

// ===================== EMAIL/PASSWORD AUTH =====================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return sendError(res, 400, 'Email and password required');
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !await bcrypt.compare(password, user.password)) {
      return sendError(res, 401, 'Invalid credentials');
    }

    user.lastLoginAt = new Date();
    await user.save();

    const token = signToken(user);
    sendSuccess(res, { user: user.toObject(), token }, 'Login successful');
  } catch (error) {
    sendError(res, 500, error.message);
  }
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role = 'user' } = req.body;

    if (!name || !email || !password) {
      return sendError(res, 400, 'Name, email and password required');
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(res, 400, 'User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      provider: 'email'
    });

    const token = signToken(user);
    sendSuccess(res, { user: user.toObject(), token }, 'Registration successful');
  } catch (error) {
    sendError(res, 500, error.message);
  }
});

// ===================== FIREBASE/GOOGLE AUTH =====================
router.post('/google', async (req, res) => {
  try {
    const { firebaseUid, displayName, email, photoURL } = req.body;

    if (!firebaseUid || !email) {
      return sendError(res, 400, 'Firebase UID and email required');
    }

    let user = await User.findOne({ 
      $or: [{ firebaseUid }, { email }] 
    });

    if (!user) {
      // Create new user
      user = await User.create({
        firebaseUid,
        name: displayName || email.split('@')[0],
        displayName: displayName || email.split('@')[0],
        email,
        photoURL,
        provider: 'google',
        isGoogleUser: true,
        profileCompleted: false,
        role: 'user'
      });

      const token = signToken(user);
      return sendSuccess(res, {
        user: user.toObject(),
        token,
        isNewUser: true,
        needsOnboarding: true
      }, 'New user created');
    }

    // Update existing user
    user.lastLoginAt = new Date();
    if (displayName) user.displayName = displayName;
    if (photoURL) user.photoURL = photoURL;
    await user.save();

    const needsOnboarding = !user.profileCompleted || !user.phone || !user.username || !user.company;
    const token = signToken(user);

    sendSuccess(res, {
      user: user.toObject(),
      token,
      isNewUser: false,
      needsOnboarding
    }, 'Login successful');
  } catch (error) {
    sendError(res, 500, error.message);
  }
});

// ===================== PASSWORD RESET =====================
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return sendError(res, 404, 'User not found');
    }

    // Generate reset token (implement actual email sending)
    const resetToken = Math.random().toString(36).substring(2, 15);
    user.resetToken = resetToken;
    user.resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    sendSuccess(res, { resetToken }, 'Reset token generated');
  } catch (error) {
    sendError(res, 500, error.message);
  }
});

module.exports = router;