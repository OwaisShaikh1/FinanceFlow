const mongoose = require('mongoose');
const User = require('./models/User');
const Business = require('./models/Business');
const Transaction = require('./models/Transaction');

// MongoDB connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb://localhost:27017/accounting_demo');
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

// Enhanced categories for better financial tracking
const categories = [
  // Income categories
  'Software Sales', 'Consulting Revenue', 'Service Income', 'Product Sales', 
  'Commission Income', 'Interest Income', 'Rental Income', 'Freelance Income',
  'Investment Returns', 'License Fees', 'Subscription Revenue', 'Training Income',
  
  // Expense categories
  'Office Rent', 'Office Supplies', 'Software Subscriptions', 'Marketing & Advertising',
  'Travel & Transport', 'Utilities', 'Internet & Phone', 'Legal & Professional',
  'Insurance', 'Equipment Purchase', 'Maintenance & Repairs', 'Fuel Expenses',
  'Training & Development', 'Banking Charges', 'Accounting Software', 'Web Hosting'
];

const paymentMethods = ['Cash', 'Bank Transfer', 'Credit Card', 'UPI', 'Cheque', 'Online Payment', 'Wallet'];

const incomeDescriptions = [
  'Website development project payment', 'Mobile app development fee', 'E-commerce platform setup',
  'Digital marketing campaign revenue', 'Software consultation service', 'Monthly retainer payment',
  'Project milestone completion payment', 'Technical training session fee', 'Code review service',
  'System integration project', 'Database optimization service', 'API development payment',
  'UI/UX design project fee', 'Cloud migration service', 'Security audit consultation',
  'Performance optimization project', 'Custom software development', 'Technical documentation',
  'Freelance programming work', 'Software license sale', 'Domain & hosting service',
  'SEO optimization service', 'Social media management', 'Content creation fee'
];

const expenseDescriptions = [
  'Office rent monthly payment', 'Electricity bill payment', 'Internet service charges',
  'Software license renewal', 'Cloud hosting charges', 'Marketing campaign cost',
  'Professional development course', 'Office supplies purchase', 'Equipment maintenance',
  'Travel expenses for client meeting', 'Fuel expenses', 'Professional consultation fee',
  'Insurance premium payment', 'Banking service charges', 'Legal documentation fee',
  'Accounting software subscription', 'Design software license', 'Server maintenance cost',
  'Office furniture purchase', 'Laptop repair charges', 'Mobile phone bills',
  'Stationery and printing costs', 'Courier and postal charges', 'Conference attendance fee'
];

const populateOwaisData = async () => {
  try {
    await connectDB();

    console.log('🔍 Finding user Owais...');
    
    // Find the specific user
    const user = await User.findOne({ email: 'owaisshaikh376@gmail.com' });
    
    if (!user) {
      console.log('❌ User not found with email: owaisshaikh376@gmail.com');
      process.exit(1);
    }

    console.log(`✅ Found user: ${user.name} (${user.email})`);

    // Get or create business
    let business = await Business.findOne({ owner: user._id });
    if (!business) {
      business = new Business({
        name: 'Owais Tech Solutions',
        gstin: '27ABCDE1234F1Z5',
        address: '123, Tech Park, Electronic City, Bangalore - 560100',
        owner: user._id,
        assignedCA: null
      });
      await business.save();
      console.log(`🏢 Created business: ${business.name}`);
      
      // Update user with business reference
      await User.findByIdAndUpdate(user._id, { business: business._id });
    } else {
      console.log(`🏢 Using existing business: ${business.name}`);
    }

    // Clear existing transactions for fresh data
    const existingCount = await Transaction.countDocuments({ user: user._id });
    if (existingCount > 0) {
      await Transaction.deleteMany({ user: user._id });
      console.log(`🗑️  Cleared ${existingCount} existing transactions`);
    }

    // Generate comprehensive transaction data
    console.log('💰 Generating comprehensive transaction data...');
    
    const transactions = [];
    const startDate = new Date('2024-01-01');
    const endDate = new Date('2024-12-31');

    // Generate monthly transactions with realistic patterns
    for (let month = 0; month < 12; month++) {
      const monthStart = new Date(2024, month, 1);
      const monthEnd = new Date(2024, month + 1, 0);
      
      // Generate 15-25 transactions per month
      const monthlyTransactionCount = Math.floor(Math.random() * 11) + 15;
      
      for (let i = 0; i < monthlyTransactionCount; i++) {
        // 65% income, 35% expenses for a profitable business
        const isIncome = Math.random() > 0.35;
        const type = isIncome ? 'income' : 'expense';
        
        let amount;
        if (type === 'income') {
          // Income: ₹5,000 to ₹1,50,000
          amount = Math.floor(Math.random() * 145000) + 5000;
        } else {
          // Expenses: ₹500 to ₹50,000
          amount = Math.floor(Math.random() * 49500) + 500;
        }

        const timestamp = Date.now() + Math.random() * 1000;
        
        const transaction = {
          id: `TXN_${timestamp}_${month}_${i}_OWAIS`,
          user: user._id,
          business: business._id,
          type: type,
          date: generateRandomDate(monthStart, monthEnd),
          description: getRandomElement(type === 'income' ? incomeDescriptions : expenseDescriptions),
          amount: amount,
          category: getRandomElement(categories),
          paymentMethod: getRandomElement(paymentMethods),
          source: 'MANUAL',
          gst: {
            rate: Math.random() > 0.6 ? [0, 5, 12, 18, 28][Math.floor(Math.random() * 5)] : 0,
            amount: 0,
            input: type === 'expense'
          }
        };

        transactions.push(transaction);
        
        // Small delay to ensure unique IDs
        await new Promise(resolve => setTimeout(resolve, 1));
      }
    }

    // Sort transactions by date
    transactions.sort((a, b) => a.date - b.date);

    console.log(`📊 Generated ${transactions.length} transactions`);

    // Insert transactions in batches to avoid memory issues
    const batchSize = 50;
    let insertedCount = 0;

    for (let i = 0; i < transactions.length; i += batchSize) {
      const batch = transactions.slice(i, i + batchSize);
      
      try {
        await Transaction.insertMany(batch, { ordered: false });
        insertedCount += batch.length;
        console.log(`✅ Inserted batch ${Math.ceil((i + 1) / batchSize)}/${Math.ceil(transactions.length / batchSize)} (${insertedCount}/${transactions.length})`);
      } catch (error) {
        console.log(`⚠️  Batch insert error: ${error.message}`);
        // Try individual inserts for failed batch
        for (const txn of batch) {
          try {
            const transaction = new Transaction(txn);
            await transaction.save();
            insertedCount++;
          } catch (individualError) {
            console.log(`    ❌ Failed to insert: ${individualError.message}`);
          }
        }
      }
    }

    // Calculate and display summary
    const finalTransactions = await Transaction.find({ user: user._id });
    const incomeTransactions = finalTransactions.filter(t => t.type === 'income');
    const expenseTransactions = finalTransactions.filter(t => t.type === 'expense');
    
    const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
    const netProfit = totalIncome - totalExpenses;

    console.log('\n📈 SUMMARY FOR OWAIS:');
    console.log('=' .repeat(40));
    console.log(`👤 User: ${user.name}`);
    console.log(`📧 Email: ${user.email}`);
    console.log(`🏢 Business: ${business.name}`);
    console.log(`💰 Total Transactions: ${finalTransactions.length}`);
    console.log(`📊 Income Transactions: ${incomeTransactions.length}`);
    console.log(`📊 Expense Transactions: ${expenseTransactions.length}`);
    console.log(`💵 Total Income: ₹${totalIncome.toLocaleString()}`);
    console.log(`💸 Total Expenses: ₹${totalExpenses.toLocaleString()}`);
    console.log(`🎯 Net Profit: ₹${netProfit.toLocaleString()}`);
    console.log(`📍 Profit Margin: ${((netProfit / totalIncome) * 100).toFixed(2)}%`);

    // Monthly breakdown
    console.log('\n📅 MONTHLY BREAKDOWN:');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let month = 0; month < 12; month++) {
      const monthTransactions = finalTransactions.filter(t => t.date.getMonth() === month);
      const monthIncome = monthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const monthExpenses = monthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
      
      console.log(`${monthNames[month]}: ₹${monthIncome.toLocaleString()} income, ₹${monthExpenses.toLocaleString()} expenses, Net: ₹${(monthIncome - monthExpenses).toLocaleString()}`);
    }

    console.log('\n🎉 Successfully populated dummy data for Owais!');
    console.log('✅ You can now test the dashboard with realistic financial data.');
    
    process.exit(0);

  } catch (error) {
    console.error('❌ Error populating Owais data:', error);
    process.exit(1);
  }
};

// Run the script
if (require.main === module) {
  populateOwaisData();
}

module.exports = { populateOwaisData };