const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/financeflow', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('✅ MongoDB Connected\n');
  
  // Search for clients with these specific emails
  const clientEmails = [
    'amit.shah@example.com',
    'priya.patel@example.com', 
    'rahul.sharma@example.com',
    'sneha.reddy@example.com',
    'vijay.singh@example.com'
  ];
  
  console.log('🔍 Searching for clients by email...\n');
  
  for (const email of clientEmails) {
    const user = await User.findOne({ email }).select('name email role _id').lean();
    if (user) {
      console.log(`✅ Found: ${user.name} (${user.email}) - Role: ${user.role}`);
    } else {
      console.log(`❌ Not found: ${email}`);
    }
  }
  
  console.log('\n--- All Users with role "user" ---');
  const userRoleUsers = await User.find({ role: 'user' }).select('name email _id').lean();
  console.log(`Total: ${userRoleUsers.length} users\n`);
  userRoleUsers.forEach(u => {
    console.log(`- ${u.name} (${u.email})`);
  });
  
  await mongoose.connection.close();
  process.exit(0);
})
.catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
