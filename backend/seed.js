require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Import models
const User = require("./models/User");
const Business = require("./models/Business");
const COA = require("./models/Coa");
const Transaction = require("./models/Transaction");
const Invoice = require("./models/Invoice");
const owais = process.env.owais;
console.log(owais);

(async () => {
  try {
    console.log("🌱 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);

    // 1. Create Admin User
    let admin = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (!admin) {
      const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
      admin = await User.create({
        name: "System Admin",
        email: process.env.ADMIN_EMAIL,
        password: hashed,
        role: "ADMIN",
      });
      console.log("✅ Admin created:", admin.email);
    } else {
      console.log("ℹ️ Admin already exists:", admin.email);
    }

    // Generate a token for quick testing
    const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });

    // 2. Create Sample Business
    let business = await Business.findOne({ name: "Acme Pvt Ltd" });
    if (!business) {
      business = await Business.create({
        name: "Acme Pvt Ltd",
        gstin: "22AAAAA0000A1Z5",
        owner: admin._id,
      });
      console.log("✅ Business created:", business.name);
    } else {
      console.log("ℹ️ Business already exists:", business.name);
    }

    // 3. Seed Chart of Accounts
    const defaultCOA = [
        { name: "Cash", type: "Asset" },
        { name: "Accounts Payable", type: "Liability" },
        { name: "Sales Revenue", type: "Income" },
        { name: "Salary Expense", type: "Expense" },
    ];


    for (let c of defaultCOA) {
      const exists = await COA.findOne({ name: c.name, business: business._id });
      if (!exists) {
        await COA.create({ ...c, business: business._id });
        console.log(`✅ COA added: ${c.name}`);
      }
    }

    // 4. Add Sample Transactions
    const salesAccount = await COA.findOne({ name: "Sales Revenue", business: business._id });
    const salaryAccount = await COA.findOne({ name: "Salary Expense", business: business._id });

    const txns = [
      { description: "Sale to Foo Corp", amount: 10000, category: "Sales", coa: salesAccount._id },
      { description: "Employee Salary", amount: 5000, category: "Salaries", coa: salaryAccount._id },
    ];

    for (let t of txns) {
      const exists = await Transaction.findOne({ description: t.description, business: business._id });
      if (!exists) {
        await Transaction.create({ ...t, business: business._id });
        console.log(`✅ Transaction added: ${t.description}`);
      }
    }

    // 5. Add Sample Invoice
    let invoice = await Invoice.findOne({ number: "INV-001", business: business._id });
    if (!invoice) {
      invoice = await Invoice.create({
        number: "INV-001",
        business: business._id,
        customerName: "Foo Corp",
        items: [{ name: "Consulting Service", qty: 1, price: 10000, gstRate: 18 }],
      });
      console.log("✅ Invoice created: INV-001");
    } else {
      console.log("ℹ️ Invoice already exists: INV-001");
    }

    console.log("\n🌟 Seed completed!");
    console.log("👉 Admin Login:");
    console.log("   Email:", process.env.ADMIN_EMAIL);
    console.log("   Password:", process.env.ADMIN_PASSWORD);
    console.log("👉 JWT Token:", token);

    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding data:", err);
    process.exit(1);
  }
})();
