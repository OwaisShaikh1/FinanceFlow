const express = require("express");
const multer = require("multer");
const Transaction = require("../models/Transaction");

// Add this at the top with your other requires
const UserCounter = require("../models/UserCounter");

const router = express.Router();

// Mock auth middleware
const auth = (req, res, next) => {
  req.user = {
    id: "650f3f0c8f8c9a12a7654321",   // fake user id
    biz: "650f3f0c8f8c9a12a1234567", // fake business id
    name: "Demo User"
  };
  next();
};

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST /api/transactions
router.post("/", auth, upload.array("receipts"), async (req, res) => {
  try {
    const { type, amount, date, category, description, notes, paymentMethod } = req.body;

    if (!type) return res.status(400).json({ message: "Type is required" });
    if (!amount || isNaN(Number(amount))) {
      return res.status(400).json({ message: "Amount must be a number" });
    }

    const amountNum = Number(amount);

    // Generate unique serial ID using persistent counter
    const userName = req.user.name || "User";
    const initials = userName
      .split(" ")
      .map(w => w[0].toUpperCase())
      .join("")
      .slice(0, 3);

    // Get or create user counter
    let counter = await UserCounter.findOne({ user: req.user.id });
    if (!counter) {
      counter = await UserCounter.create({ user: req.user.id, lastSerial: 0 });
    }

    counter.lastSerial += 1;
    await counter.save();

    const serialId = `${initials}-${String(counter.lastSerial).padStart(4, "0")}`;

    // Convert uploaded files to schema format
    const files = req.files?.map(f => ({
      filename: f.originalname,
      contentType: f.mimetype,
      data: f.buffer
    })) || [];

  // Prepare transaction object
const txData = {
  id: serialId,
  business: req.user.biz,
  user: req.user.id,
  date: date ? new Date(date) : new Date(),
  type,
  amount: amountNum,
  category,
  description,
  notes,
  paymentMethod,
  receipts: files,
  source: "MANUAL"
};

// Log the transaction before saving
console.log("Transaction to be saved:", txData);

// Save to database
const tx = await Transaction.create(txData);

// tx now contains the saved document

    return res.status(201).json(tx);
  } catch (e) {
    console.error("Transaction error:", e);
    return res.status(500).json({ message: e.message });
  }
});

module.exports = router;
