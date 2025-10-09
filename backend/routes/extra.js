const express = require("express");
const router = express.Router();
const User = require("../models/User");

// POST /api/extrainfo
router.post("/", async (req, res) => {
  const { firebaseUid, phone, role, company } = req.body;

  try {
    const user = await User.findOne({ firebaseUid });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Update only the extra fields
    user.phone = phone;
    user.role = role;
    user.company = company;

    await user.save();

    return res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
