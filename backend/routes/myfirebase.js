const express = require("express");
const router = express.Router();
const User = require("../models/User");

// JWT signing function
const jwt = require('jsonwebtoken');
const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role, biz: user.business }, process.env.JWT_SECRET, { expiresIn: '7d' });

// GET /api/firebaselogin - Health check
router.get("/", (req, res) => {
  res.json({ success: true, message: "Firebase auth endpoint is working" });
});

// POST /api/firebaselogin
router.post("/", async (req, res) => {
  console.log("=== Firebase Login Request ===");
  console.log("Request body:", req.body);
  
  const { firebaseUid, displayName, email, photoURL, provider } = req.body;
  
  console.log("Extracted data:", { firebaseUid, displayName, email, photoURL, provider });

  try {
    let user = await User.findOne({ firebaseUid });

    if (!user) {
      // First-time login → create basic Firebase user with minimal data
      user = new User({ 
        firebaseUid, 
        name: displayName || email.split('@')[0], // Use displayName or extract from email
        displayName: displayName || email.split('@')[0], 
        email, 
        photoURL, 
        provider,
        isGoogleUser: true,
        profileCompleted: false, // Mark as incomplete - needs onboarding
        accountStatus: 'active',
        role: 'user', // Default role for new users
        createdAt: new Date()
      });
      
      console.log("Creating new user with data:", {
        firebaseUid, 
        name: displayName || email.split('@')[0],
        displayName: displayName || email.split('@')[0], 
        email, 
        photoURL, 
        provider,
        isGoogleUser: true,
        profileCompleted: false
      });
      await user.save();
      console.log(`New Firebase user created: ${email}`);
      
      // Generate JWT token for new user
      const token = signToken(user);
      return res.json({ 
        success: true,
        isNewUser: true,
        needsOnboarding: true, // Flag to indicate onboarding needed
        user: user.toObject(),
        token 
      });
    }

    // Existing user → check if profile is completed
    user.lastLoginAt = new Date();
    if (displayName) user.displayName = displayName;
    if (photoURL) user.photoURL = photoURL;
    await user.save();
    
    console.log(`Existing Firebase user logged in: ${email}`);
    
    // Generate JWT token for existing user
    const token = signToken(user);
    
    // Check if user needs to complete onboarding
    const needsOnboarding = !user.profileCompleted || !user.phone || !user.username || !user.company;
    
    return res.json({ 
      success: true,
      isNewUser: false,
      needsOnboarding: needsOnboarding, // Flag if profile is incomplete
      user: user.toObject(),
      token 
    });
  } catch (err) {
    console.error("Firebase login error:", err);
    console.error("Error stack:", err.stack);
    return res.status(500).json({ success: false, error: "Server error during Firebase authentication", details: err.message });
  }
});

module.exports = router;
