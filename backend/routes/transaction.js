const express = require("express");
const multer = require("multer");
const Transaction = require("../models/Transaction");

const router = express.Router();

// Mock auth middleware
const auth = (req, res, next) => {
  req.user = { biz: "650f3f0c8f8c9a12a1234567" };
  next();
};

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const ts = Date.now();
    const safe = file.originalname.replace(/\s+/g, "_");
    cb(null, `${ts}_${safe}`);
  },
});
const upload = multer({ storage });

// POST /api/transactions
router.post("/", auth, upload.array("receipts"), async (req, res) => {
  try {
    const { description, amount, category, coa, date, gstRate, gstInput, type } = req.body;
    const amountNum = Number(amount);

    // 1. Get user initials (example: "Owais Shaikh" => "OS")
    const userName = req.user.name || "User"; // assume you have req.user from auth
    const initials = userName
      .split(" ")
      .map(word => word[0].toUpperCase())
      .join("")
      .slice(0, 3); // limit to 2–3 chars

    // 2. Count how many transactions this user already has
    const count = await Transaction.countDocuments({ user: req.user.id });

    // 3. Generate serial id
    const serialId = `${initials}-${String(count + 1).padStart(4, "0")}`;

    // 4. Create transaction
    const tx = await Transaction.create({
      id: serialId,
      business: req.user.biz,
      date: date ? new Date(date) : new Date(),
      description,
      amount: amountNum,
      type,
      category,
      coa: coa || undefined,
      receiptUrl: req.files?.map((f) => `/uploads/${f.filename}`),
      source: "MANUAL",
      gst: gstRate
        ? {
            rate: Number(gstRate),
            amount: (amountNum * Number(gstRate)) / 100,
            input: !!gstInput,
          }
        : undefined,
    });

    return res.status(201).json(tx);
  } catch (e) {
    console.error("Transaction error:", e);
    return res.status(400).json({ message: e.message });
  }
});


// GET /api/transactions
router.get("/", auth, async (req, res) => {
  try {
    const { from, to, category } = req.query;
    const q = { business: req.user.biz };

    if (from || to) q.date = {};
    if (from) q.date.$gte = new Date(from);
    if (to) q.date.$lte = new Date(to);
    if (category) q.category = category;

    const list = await Transaction.find(q).sort({ date: -1 }).lean();
    return res.json(list);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
