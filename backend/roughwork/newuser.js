const mongoose = require("mongoose");
const User = require("../models/User"); // adjust path if needed
require("dotenv").config({ path: '../.env' });

async function createUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, { dbName: "financeflow" });
    console.log("✅ MongoDB connected");

    const email = "owaisshaikh376@gmail.com";

    // Remove existing user with same email (optional)
    await User.deleteOne({ email });

    // Create new user
    const user = new User({
      name: "Owais",
      email: email,
      password: "owais", // plaintext; will be hashed automatically
      role: "EMPLOYEE",  // make sure role matches your enum/allowed roles
    });

    await user.save();
    console.log("✅ User created successfully");

    // Disconnect
    await mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error creating user ->", err.message);
  }
}

createUser();
