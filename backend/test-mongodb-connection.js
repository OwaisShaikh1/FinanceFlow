const mongoose = require('mongoose');
require('dotenv').config();

console.log('🔍 MongoDB Connection Diagnostics\n');
console.log('Connection String:', process.env.MONGODB_URI?.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@'));
console.log('\nAttempting connection...\n');

const options = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

mongoose.connect(process.env.MONGODB_URI, options)
  .then(() => {
    console.log('✅ SUCCESS! MongoDB connected');
    console.log('Database:', mongoose.connection.db.databaseName);
    console.log('Host:', mongoose.connection.host);
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ CONNECTION FAILED\n');
    console.error('Error:', err.message);
    console.error('Code:', err.code);
    console.error('\n📋 Troubleshooting Steps:\n');
    
    if (err.message.includes('ETIMEOUT') || err.message.includes('querySrv')) {
      console.error('🔴 DNS/Network Timeout Issue:');
      console.error('   → Your IP may not be whitelisted in MongoDB Atlas');
      console.error('   → Go to: MongoDB Atlas → Network Access → Add IP Address');
      console.error('   → Add your current IP or use 0.0.0.0/0 (allow all) for testing');
      console.error('   → Check your internet connection/firewall');
    } else if (err.message.includes('authentication failed')) {
      console.error('🔴 Authentication Issue:');
      console.error('   → Check username/password in connection string');
      console.error('   → Verify database user exists in MongoDB Atlas');
    } else if (err.message.includes('ENOTFOUND')) {
      console.error('🔴 Cluster Not Found:');
      console.error('   → Check if cluster is paused (free tier auto-pauses)');
      console.error('   → Verify cluster URL is correct');
    }
    
    console.error('\n💡 Quick Fixes:');
    console.error('   1. Visit: https://cloud.mongodb.com/');
    console.error('   2. Go to Network Access → Add IP Address → "Allow Access from Anywhere"');
    console.error('   3. Check if cluster is running (not paused)');
    console.error('   4. Try again after adding IP\n');
    
    process.exit(1);
  });
