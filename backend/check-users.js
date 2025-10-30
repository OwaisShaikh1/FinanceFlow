const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/financeflow', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('✅ MongoDB Connected\n');
  
  const users = await User.find({}).select('name email role _id').lean();
  
  console.log(`Found ${users.length} users:\n`);
  users.forEach(user => {
    console.log(`- ${user.name || 'No name'} (${user.email || 'No email'}) - Role: ${user.role || 'No role'} - ID: ${user._id}`);
  });
  
  console.log('\n--- Role Distribution ---');
  const roleCount = {};
  users.forEach(user => {
    const role = user.role || 'undefined';
    roleCount[role] = (roleCount[role] || 0) + 1;
  });
  Object.entries(roleCount).forEach(([role, count]) => {
    console.log(`${role}: ${count}`);
  });
  
  await mongoose.connection.close();
  process.exit(0);
})
.catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
