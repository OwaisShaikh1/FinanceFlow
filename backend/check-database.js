const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('✅ MongoDB Connected to:', mongoose.connection.name, '\n');
  
  // List all collections
  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log('📚 Collections in database:');
  collections.forEach(col => {
    console.log(`   - ${col.name}`);
  });
  
  // Count documents in users collection
  const usersCount = await mongoose.connection.db.collection('users').countDocuments();
  console.log(`\n👥 Total users: ${usersCount}`);
  
  // Get all users
  const users = await mongoose.connection.db.collection('users').find({}).toArray();
  console.log('\n📋 All Users:');
  users.forEach(user => {
    console.log(`   - ${user.name || 'No name'} (${user.email || 'No email'}) - Role: ${user.role || 'No role'}`);
  });
  
  await mongoose.connection.close();
  process.exit(0);
})
.catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
