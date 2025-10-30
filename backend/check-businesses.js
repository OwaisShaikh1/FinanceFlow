const mongoose = require('mongoose');
require('dotenv').config();

const Business = require('./models/Business');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/financeflow', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('✅ MongoDB Connected\n');
  
  const businesses = await Business.find({}).populate('owner', 'name email').lean();
  
  console.log(`Found ${businesses.length} businesses:\n`);
  businesses.forEach(business => {
    console.log(`- ${business.name} (${business.isActive ? 'Active' : 'Inactive'})`);
    if (business.owner) {
      console.log(`  Owner: ${business.owner.name} (${business.owner.email})`);
    }
  });
  
  await mongoose.connection.close();
  process.exit(0);
})
.catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
