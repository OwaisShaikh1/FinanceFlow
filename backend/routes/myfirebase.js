const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require('jsonwebtoken');

// JWT signing helper
const signToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role, biz: user.business },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

// GET /api/firebaselogin - Health check
router.get("/", (req, res) => {
  res.json({ success: true, message: "Firebase auth endpoint is working" });
});

// POST /api/firebaselogin
router.post("/", async (req, res) => {
  console.log("=== Firebase Login Request ===");
  console.log("Request body:", req.body);

  const { firebaseUid, displayName, email, photoURL, provider } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      error: "Email is required for Firebase login",
    });
  }

  try {
    // 🔍 Step 1: Check if a user already exists (by firebaseUid or email)
    let user = await User.findOne({
      $or: [{ firebaseUid }, { email }],
    });

    let isNewUser = false;

    if (!user) {
      // 🆕 Step 2: Create a new user if none found
      isNewUser = true;

      user = new User({
        firebaseUid,
        name: displayName || email.split('@')[0],
        displayName: displayName || email.split('@')[0],
        email,
        photoURL,
        provider,
        isGoogleUser: true,
        profileCompleted: false,
        accountStatus: 'active',
        role: 'user',
        createdAt: new Date(),
      });

      console.log("Creating new Firebase user:", {
        firebaseUid,
        email,
        provider,
      });

      await user.save();
      console.log(`✅ New Firebase user created: ${email}`);
    } else {
      // 👤 Step 3: Existing user – update info and login
      user.lastLoginAt = new Date();
      if (displayName) user.displayName = displayName;
      if (photoURL) user.photoURL = photoURL;
      if (!user.firebaseUid && firebaseUid) {
        // Link Firebase UID if missing
        user.firebaseUid = firebaseUid;
      }
      await user.save();
      console.log(`🔁 Existing Firebase user logged in: ${email}`);
    }

    // 🪙 Step 4: Generate JWT token
    const token = signToken(user);

    // 🧩 Step 5: Determine onboarding requirement
    const needsOnboarding =
      !user.profileCompleted || !user.phone || !user.username || !user.company;

    // ✅ Step 6: Return response
    return res.json({
      success: true,
      isNewUser,
      needsOnboarding,
      user: user.toObject(),
      token,
    });
  } catch (err) {
    console.error("❌ Firebase login error:", err);
    return res.status(500).json({
      success: false,
      error: "Server error during Firebase authentication",
      details: err.message,
    });
  }
});

module.exports = router;
