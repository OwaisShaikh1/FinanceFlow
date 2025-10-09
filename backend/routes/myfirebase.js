const express = require("express");
const router = express.Router();
const User = require("../models/User");

// POST /api/firebaselogin
router.post("/", async (req, res) => {
  const { firebaseUid, displayName, email, photoURL, provider } = req.body;

  try {
    let user = await User.findOne({ firebaseUid });

    if (!user) {
      // First-time login → create basic Firebase user
      user = new User({ 
        firebaseUid, 
        displayName, 
        email, 
        photoURL, 
        provider,
        accountStatus: 'active',
        createdAt: new Date()
      });
      await user.save();
      console.log(`New Firebase user created: ${email}`);
      return res.json({ isNewUser: true, user: user.toObject() });
    }

    // Existing user → update login info and return
    user.lastLoginAt = new Date();
    if (displayName) user.displayName = displayName;
    if (photoURL) user.photoURL = photoURL;
    await user.save();
    
    console.log(`Existing Firebase user logged in: ${email}`);
    return res.json({ isNewUser: false, user: user.toObject() });
  } catch (err) {
    console.error("Firebase login error:", err);
    return res.status(500).json({ error: "Server error during Firebase authentication" });
  }
});

module.exports = router;
