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
      user = new User({ firebaseUid, displayName, email, photoURL, provider });
      await user.save();
      return res.json({ isNewUser: true, user });
    }

    // Existing user → just return
    return res.json({ isNewUser: false, user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
