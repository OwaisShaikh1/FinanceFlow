const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Business = require('./models/Business');
const Transaction = require('./models/Transaction');

// MongoDB connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb://localhost:27017/accounting_demo', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

// Dummy data generators
const generateRandomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const getRandomElement = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

// Business names and types
const businessNames = [
  'Tech Solutions Ltd', 'Green Earth Consulting', 'Digital Marketing Pro',
  'Fashion Forward Boutique', 'Healthy Eats Cafe', 'Smart Home Systems',
  'Creative Design Studio', 'Local Transport Services', 'Educational Hub',
  'Medical Care Center', 'Fitness First Gym', 'Auto Repair Shop',
  'Beauty & Wellness Spa', 'Construction Co.', 'Real Estate Advisors'
];

const categories = [
  'Office Supplies', 'Marketing', 'Travel', 'Utilities', 'Rent',
  'Software', 'Equipment', 'Consulting', 'Insurance', 'Legal',
  'Training', 'Maintenance', 'Fuel', 'Telecommunications', 'Banking',
  'Sales', 'Service Income', 'Product Sales', 'Consulting Revenue',
  'Commission', 'Interest Income', 'Rental Income'
];

const paymentMethods = ['Cash', 'Bank Transfer', 'Credit Card', 'UPI', 'Cheque', 'Online'];

const descriptions = {
  income: [
    'Product sales revenue', 'Consulting service fee', 'Monthly retainer payment',
    'Project milestone payment', 'Commission from sales', 'Interest earned',
    'Rental income received', 'Service charges', 'Subscription payment',
    'License fee received'
  ],
  expense: [
    'Office rent payment', 'Utility bills', 'Software subscription',
    'Marketing campaign cost', 'Travel expenses', 'Equipment purchase',
    'Consulting fees paid', 'Insurance premium', 'Legal consultation',
    'Staff training cost', 'Maintenance charges', 'Fuel expenses'
  ]
};

// Generate GST number
const generateGSTIN = () => {
  const stateCode = Math.floor(Math.random() * 37) + 1;
  const panLike = Math.random().toString(36).substring(2, 12).toUpperCase();
  const entityCode = Math.floor(Math.random() * 10);
  const checksum = Math.floor(Math.random() * 10);
  return `${stateCode.toString().padStart(2, '0')}${panLike}${entityCode}Z${checksum}`;
};

// Generate phone number
const generatePhone = () => {
  return `+91${Math.floor(Math.random() * 9000000000) + 1000000000}`;
};

// Generate address
const generateAddress = () => {
  const streets = ['MG Road', 'Park Street', 'Church Street', 'Brigade Road', 'Commercial Street'];
  const areas = ['Koramangala', 'Indiranagar', 'Whitefield', 'Electronic City', 'Hebbal'];
  const cities = ['Bangalore', 'Mumbai', 'Delhi', 'Chennai', 'Pune'];
  
  return `${Math.floor(Math.random() * 999) + 1}, ${getRandomElement(streets)}, ${getRandomElement(areas)}, ${getRandomElement(cities)} - ${Math.floor(Math.random() * 899999) + 100000}`;
};

const populateDummyData = async () => {
  try {
    await connectDB();

    console.log('🔍 Fetching existing users...');
    const existingUsers = await User.find({});
    console.log(`Found ${existingUsers.length} existing users`);

    if (existingUsers.length === 0) {
      console.log('⚠️  No existing users found. Creating sample users first...');
      
      // Create sample users
      const sampleUsers = [
        {
          name: 'John Smith',
          email: 'john.smith@example.com',
          password: 'password123',
          phone: generatePhone(),
          role: 'user'
        },
        {
          name: 'Sarah Johnson',
          email: 'sarah.johnson@example.com',
          password: 'password123',
          phone: generatePhone(),
          role: 'user'
        },
        {
          name: 'Michael Brown',
          email: 'michael.brown@example.com',
          password: 'password123',
          phone: generatePhone(),
          role: 'admin'
        },
        {
          name: 'Emily Davis',
          email: 'emily.davis@example.com',
          password: 'password123',
          phone: generatePhone(),
          role: 'user'
        },
        {
          name: 'David Wilson',
          email: 'david.wilson@example.com',
          password: 'password123',
          phone: generatePhone(),
          role: 'user'
        }
      ];

      for (const userData of sampleUsers) {
        const user = new User(userData);
        await user.save();
        console.log(`✅ Created user: ${user.name} (${user.email})`);
      }
      
      // Refresh user list
      const newUsers = await User.find({});
      await populateUserData(newUsers);
    } else {
      await populateUserData(existingUsers);
    }

    console.log('🎉 Dummy data population completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error populating dummy data:', error);
    process.exit(1);
  }
};

const populateUserData = async (users) => {
  console.log('\n📊 Populating dummy data for users...');

  for (const user of users) {
    console.log(`\n👤 Processing user: ${user.name} (${user.email})`);

    // Create or update business for user
    let business = await Business.findOne({ owner: user._id });
    
    if (!business) {
      business = new Business({
        name: getRandomElement(businessNames),
        gstin: generateGSTIN(),
        address: generateAddress(),
        owner: user._id,
        assignedCA: null
      });
      await business.save();
      console.log(`  🏢 Created business: ${business.name}`);

      // Update user with business reference
      await User.findByIdAndUpdate(user._id, { business: business._id });
      console.log(`  🔗 Linked user to business`);
    } else {
      console.log(`  🏢 Using existing business: ${business.name}`);
    }

    // Check if user already has transactions
    const existingTransactions = await Transaction.countDocuments({ user: user._id });
    if (existingTransactions > 0) {
      console.log(`  ⚠️  User already has ${existingTransactions} transactions. Skipping transaction generation.`);
      continue;
    }

    // Generate transactions for the user
    const transactionCount = Math.floor(Math.random() * 50) + 20; // 20-70 transactions
    console.log(`  💰 Generating ${transactionCount} transactions...`);

    const transactions = [];
    const startDate = new Date('2024-01-01');
    const endDate = new Date('2024-12-31');

    for (let i = 0; i < transactionCount; i++) {
      const isIncome = Math.random() > 0.4; // 60% income, 40% expense
      const type = isIncome ? 'income' : 'expense';
      const timestamp = Date.now();
      
      const transaction = {
        id: `TXN_${timestamp}_${i}_${user._id.toString().slice(-4)}`, // Unique transaction ID
        user: user._id,
        business: business._id,
        type: type,
        date: generateRandomDate(startDate, endDate),
        description: getRandomElement(descriptions[type]),
        amount: Math.floor(Math.random() * 50000) + 1000, // ₹1,000 to ₹50,000
        category: getRandomElement(categories),
        paymentMethod: getRandomElement(paymentMethods),
        source: 'MANUAL',
        gst: {
          rate: Math.random() > 0.7 ? [0, 5, 12, 18, 28][Math.floor(Math.random() * 5)] : 0,
          amount: 0,
          input: type === 'expense'
        }
      };

      transactions.push(transaction);
      
      // Small delay to ensure unique timestamps
      await new Promise(resolve => setTimeout(resolve, 1));
    }

    // Insert transactions one by one to avoid bulk errors
    let createdCount = 0;
    for (const transactionData of transactions) {
      try {
        const transaction = new Transaction(transactionData);
        await transaction.save();
        createdCount++;
      } catch (error) {
        console.log(`    ⚠️  Skipped duplicate transaction: ${error.message}`);
      }
    }
    
    console.log(`  ✅ Created ${createdCount} transactions`);

    // Calculate and display summary
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    console.log(`  📈 Summary: ₹${totalIncome.toLocaleString()} income, ₹${totalExpenses.toLocaleString()} expenses, Net: ₹${(totalIncome - totalExpenses).toLocaleString()}`);
  }
};

// Statistics summary
const displayStatistics = async () => {
  const userCount = await User.countDocuments();
  const businessCount = await Business.countDocuments();
  const transactionCount = await Transaction.countDocuments();

  console.log('\n📊 DATABASE STATISTICS:');
  console.log(`Users: ${userCount}`);
  console.log(`Businesses: ${businessCount}`);
  console.log(`Transactions: ${transactionCount}`);

  // Transaction summary by type
  const incomeTransactions = await Transaction.find({ type: 'income' });
  const expenseTransactions = await Transaction.find({ type: 'expense' });
  
  const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);

  console.log(`Total Income: ₹${totalIncome.toLocaleString()}`);
  console.log(`Total Expenses: ₹${totalExpenses.toLocaleString()}`);
  console.log(`Net Profit: ₹${(totalIncome - totalExpenses).toLocaleString()}`);
};

// Run the population script
if (require.main === module) {
  populateDummyData().then(() => displayStatistics());
}

module.exports = { populateDummyData, displayStatistics };