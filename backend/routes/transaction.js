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

router.get('/', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ business: req.user.biz });
    return res.json(transactions);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});

// Dashboard stats endpoint
router.get('/dashboard-stats', auth, async (req, res) => {
  try {
    // Get all transactions for the business
    const transactions = await Transaction.find({ business: req.user.biz }).lean();
    
    // Calculate totals (database has lowercase 'income' and 'expense')
    const totalIncome = transactions
      .filter(tx => tx.type === 'income')
      .reduce((sum, tx) => sum + tx.amount, 0);
    
    const totalExpenses = transactions
      .filter(tx => tx.type === 'expense')
      .reduce((sum, tx) => sum + tx.amount, 0);
    
    const netProfit = totalIncome - totalExpenses;
    
    // Count all transactions (total entries)
    const totalTransactions = transactions.length;

    res.json({
      totalIncome,
      totalExpenses,
      netProfit,
      transactionCount: totalTransactions
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Dashboard chart data endpoint
router.get('/chart-data', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ business: req.user.biz }).lean();
    
    // Group transactions by month for the last 12 months
    const monthlyData = {};
    const currentDate = new Date();
    
    // Initialize 12 months of data
    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short' });
      monthlyData[monthKey] = { income: 0, expenses: 0, profit: 0, transactions: 0 };
    }
    
    // Process transactions
    transactions.forEach(tx => {
      const txDate = new Date(tx.date);
      const monthKey = txDate.toLocaleDateString('en-US', { month: 'short' });
      
      if (monthlyData[monthKey]) {
        if (tx.type === 'income') {
          monthlyData[monthKey].income += tx.amount;
        } else if (tx.type === 'expense') {
          monthlyData[monthKey].expenses += tx.amount;
        }
        monthlyData[monthKey].transactions += 1; // Count all transactions
        monthlyData[monthKey].profit = monthlyData[monthKey].income - monthlyData[monthKey].expenses;
      }
    });
    
    // Convert to array format for chart
    const chartData = Object.keys(monthlyData).map(month => ({
      month,
      income: monthlyData[month].income,
      expenses: monthlyData[month].expenses,
      profit: monthlyData[month].profit,
      transactions: monthlyData[month].transactions
    }));
    
    res.json(chartData);
  } catch (error) {
    console.error('Chart data error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/transactions/:id - Update a transaction
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { type, amount, date, category, description, notes, paymentMethod } = req.body;

    // Validate required fields
    if (!type) return res.status(400).json({ message: "Type is required" });
    if (!amount || isNaN(Number(amount))) {
      return res.status(400).json({ message: "Amount must be a number" });
    }

    const amountNum = Number(amount);

    // Find the transaction to update
    const transaction = await Transaction.findOne({ 
      id: id, 
      user: req.user.id 
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Update the transaction
    const updatedTransaction = await Transaction.findOneAndUpdate(
      { id: id, user: req.user.id },
      {
        type,
        amount: amountNum,
        date: new Date(date),
        category: category || 'General',
        description: description || '',
        notes: notes || '',
        paymentMethod: paymentMethod || 'Cash',
        updatedAt: new Date()
      },
      { new: true }
    );

    res.json({
      message: "Transaction updated successfully",
      transaction: updatedTransaction
    });

  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/transactions/:id - Delete a transaction
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the transaction
    const transaction = await Transaction.findOneAndDelete({ 
      id: id, 
      user: req.user.id 
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json({
      message: "Transaction deleted successfully",
      transaction: transaction
    });

  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

console.log('Transaction routes loaded');
module.exports = router;
