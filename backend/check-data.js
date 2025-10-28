const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

async function checkData() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected');
    
    // Check all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\nCollections:', collections.map(c => c.name));
    
    // Check businesses collection
    const Business = mongoose.connection.collection('businesses');
    const count = await Business.countDocuments();
    console.log(`\nBusinesses count: ${count}`);
    
    if (count > 0) {
      const businesses = await Business.find({}).toArray();
      console.log('\nBusinesses:', JSON.stringify(businesses, null, 2));
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkData();
