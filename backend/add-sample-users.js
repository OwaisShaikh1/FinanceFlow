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

const addMoreUsers = async () => {
  try {
    await connectDB();

    console.log('🔍 Checking existing users...');
    const existingUsers = await User.find({});
    console.log(`Found ${existingUsers.length} existing users`);

    // Sample users to add
    const newUsersData = [
      {
        name: 'Alice Cooper',
        email: 'alice.cooper@businessmail.com',
        password: 'password123',
        phone: '+919876543210',
        role: 'user'
      },
      {
        name: 'Bob Williams',
        email: 'bob.williams@company.com',
        password: 'password123',
        phone: '+919876543211',
        role: 'user'
      },
      {
        name: 'Carol Martinez',
        email: 'carol.martinez@enterprise.com',
        password: 'password123',
        phone: '+919876543212',
        role: 'admin'
      },
      {
        name: 'Daniel Lee',
        email: 'daniel.lee@startup.com',
        password: 'password123',
        phone: '+919876543213',
        role: 'user'
      },
      {
        name: 'Eva Rodriguez',
        email: 'eva.rodriguez@consulting.com',
        password: 'password123',
        phone: '+919876543214',
        role: 'user'
      }
    ];

    const createdUsers = [];

    for (const userData of newUsersData) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        console.log(`⚠️  User ${userData.email} already exists, skipping...`);
        continue;
      }

      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
      console.log(`✅ Created user: ${user.name} (${user.email})`);
    }

    console.log(`\n🎯 Created ${createdUsers.length} new users`);
    
    // Now populate data for all users (existing + new)
    const allUsers = await User.find({});
    
    // Import the population functions from the main script
    const { populateUserData } = require('./populate-dummy-data');
    await require('./populate-dummy-data').populateUserData(allUsers);
    
    console.log('🎉 Successfully added users and populated with dummy data!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error adding users:', error);
    process.exit(1);
  }
};

// Run the script
if (require.main === module) {
  addMoreUsers();
}

module.exports = { addMoreUsers };