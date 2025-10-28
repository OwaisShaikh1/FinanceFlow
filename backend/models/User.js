const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  // Basic user info
  name: { type: String, required: true, default: "User", trim: true, index: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  password: { type: String, required: false }, // Optional for Firebase users
  role: { type: String, enum: ['user', 'admin', 'ca', 'Admin', 'CA'], default: "user", index: true },
  
  // Contact info
  phone: { type: String, trim: true },
  address: { type: String, trim: true },
  city: { type: String, trim: true },
  state: { type: String, trim: true },
  pincode: { type: String, trim: true },
  company: { type: String, trim: true },
  
  // Business info
  businessName: { type: String, trim: true },
  businessType: { type: String, trim: true },
  pan: { type: String, uppercase: true, trim: true, sparse: true, index: true },
  avatar: { type: String },
  defaultTaxRate: { type: Number, default: 18, min: 0, max: 100 },
  
  // Firebase authentication
  firebaseUid: { type: String, unique: true, sparse: true, index: true },
  displayName: { type: String, trim: true },
  photoURL: { type: String },
  provider: { type: String, enum: ['email', 'google', 'facebook'], default: 'email' },
  isGoogleUser: { type: Boolean, default: false },
  profileCompleted: { type: Boolean, default: false, index: true },
  username: { type: String, trim: true, sparse: true, unique: true },
  
  // Business reference
  business: { type: mongoose.Schema.Types.ObjectId, ref: "Business", index: true },

  // GST & tax data
  filingScheme: { type: String, enum: ['monthly', 'qrmp'], default: 'monthly' },
  gstin: { type: String, uppercase: true, trim: true, sparse: true, index: true },
  taxData: {
    annualIncome: { type: Number, default: 0, min: 0 },
    taxRegime: { type: String, enum: ['old', 'new'], default: 'new' },
    section80C: { type: Number, default: 0, min: 0 },
    section80D: { type: Number, default: 0, min: 0 },
    section80G: { type: Number, default: 0, min: 0 },
    section80E: { type: Number, default: 0, min: 0 },
    section80EE: { type: Number, default: 0, min: 0 },
    section80GGC: { type: Number, default: 0, min: 0 },
    otherDeductions: { type: Number, default: 0, min: 0 },
    taxBeforeInvestments: { type: Number, default: 0 },
    taxAfterInvestments: { type: Number, default: 0 },
    totalTaxSaved: { type: Number, default: 0 },
    estimatedAnnualTax: { type: Number, default: 0 },
    advanceTaxPaid: { type: Number, default: 0 },
    nextDueDate: { type: String, default: '' },
    lastCalculatedAt: { type: Date },
    paymentReminders: [{
      amount: { type: Number, required: true },
      dueDate: { type: Date, required: true },
      quarter: { type: String, required: true },
      status: { type: String, enum: ['pending', 'paid'], default: 'pending' },
      createdAt: { type: Date, default: Date.now }
    }],
  },

  // Preferences
  preferences: {
    theme: { type: String, enum: ['light', 'dark', 'auto'], default: 'light' },
    language: { type: String, default: 'en' },
    currency: { type: String, default: 'INR' },
    dateFormat: { type: String, default: 'DD/MM/YYYY' },
    emailNotifications: { type: Boolean, default: true },
    smsNotifications: { type: Boolean, default: false },
    reminderNotifications: { type: Boolean, default: true }
  },
  
  // Security settings
  security: {
    twoFactorAuth: { type: Boolean, default: false },
    sessionTimeout: { type: Number, default: 30 }
  },

  // Status
  isActive: { type: Boolean, default: true },
  isEmailVerified: { type: Boolean, default: false },
  emailVerificationToken: { type: String },
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date },
  lastLoginAt: { type: Date },
  loginCount: { type: Number, default: 0 }
}, {
  collection: "users",
  timestamps: true
});

// Hash password if modified
userSchema.pre("save", async function(next) {
  if (!this.isModified("password") || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = function(candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Return safe user object (without sensitive data)
userSchema.methods.toSafeObject = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.emailVerificationToken;
  delete obj.passwordResetToken;
  delete obj.passwordResetExpires;
  return obj;
};

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return this.displayName || this.name || 'User';
});

userSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model("User", userSchema);
