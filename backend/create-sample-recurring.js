const mongoose = require('mongoose');
require('dotenv').config();

const RecurringTemplate = require('./models/RecuringTemplate');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/financeflow';

// Sample data for 2 different users
const sampleTemplates = [
  // For Vijay Singh (business ID will be replaced)
  {
    templateName: 'Monthly Retainer - Vijay',
    everyDays: 30,
    amount: 28000,
    client: 'Vijay Tech Solutions'
  },
  {
    templateName: 'Quarterly Consulting - Vijay',
    everyDays: 90,
    amount: 82000,
    client: 'Vijay Tech Solutions'
  },
  {
    templateName: 'Weekly Support - Vijay',
    everyDays: 7,
    amount: 9500,
    client: 'Vijay Tech Solutions'
  },
  // For Sneha (business ID will be replaced)
  {
    templateName: 'Monthly Retainer - Sneha',
    everyDays: 30,
    amount: 32000,
    client: 'Sneha Enterprises'
  },
  {
    templateName: 'Annual Maintenance - Sneha',
    everyDays: 365,
    amount: 150000,
    client: 'Sneha Enterprises'
  },
  {
    templateName: 'Bi-Weekly Service - Sneha',
    everyDays: 14,
    amount: 18000,
    client: 'Sneha Enterprises'
  },
];

async function populateRecurringInvoices() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Get some business IDs from the database
    const Business = require('./models/Business');
    const businesses = await Business.find().limit(10).lean();
    
    if (businesses.length < 2) {
      console.log('⚠️  Need at least 2 businesses in database');
      console.log('💡 Creating with dummy business IDs for now...');
      
      // Use dummy Object IDs if no businesses found
      const dummyBusiness1 = new mongoose.Types.ObjectId();
      const dummyBusiness2 = new mongoose.Types.ObjectId();
      
      console.log('\n📝 Using dummy business IDs:');
      console.log(`   Business 1 (Vijay): ${dummyBusiness1}`);
      console.log(`   Business 2 (Sneha): ${dummyBusiness2}`);
      
      await createTemplates(dummyBusiness1, sampleTemplates.slice(0, 3), 'Vijay Singh');
      await createTemplates(dummyBusiness2, sampleTemplates.slice(3, 6), 'Sneha');
    } else {
      console.log(`\n📊 Found ${businesses.length} businesses in database`);
      console.log(`   Using first 2 businesses for sample data...`);
      
      await createTemplates(businesses[0]._id, sampleTemplates.slice(0, 3), businesses[0].name);
      await createTemplates(businesses[1]._id, sampleTemplates.slice(3, 6), businesses[1].name);
    }

    // Show summary
    const allTemplates = await RecurringTemplate.find().populate('business', 'name');
    console.log(`\n✨ Total recurring templates in database: ${allTemplates.length}`);
    
    console.log('\n📋 Templates by business:');
    const byBusiness = {};
    allTemplates.forEach(template => {
      const businessId = template.business?._id?.toString() || 'Unknown';
      const businessName = template.business?.name || `Business ${businessId.slice(-6)}`;
      if (!byBusiness[businessName]) {
        byBusiness[businessName] = [];
      }
      byBusiness[businessName].push(template.template.templateName);
    });

    Object.entries(byBusiness).forEach(([business, templates]) => {
      console.log(`\n   ${business}:`);
      templates.forEach(t => console.log(`      - ${t}`));
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Disconnected from MongoDB');
    process.exit(0);
  }
}

async function createTemplates(businessId, templates, businessName) {
  console.log(`\n🏢 Creating templates for ${businessName}...`);
  
  for (const templateData of templates) {
    // Check if exists
    const exists = await RecurringTemplate.findOne({
      business: businessId,
      'template.templateName': templateData.templateName
    });

    if (exists) {
      console.log(`   ⏭️  "${templateData.templateName}" already exists, skipping...`);
      continue;
    }

    // Random next run date (within next 30 days)
    const daysUntilNext = Math.floor(Math.random() * 30) + 1;
    const nextRun = new Date();
    nextRun.setDate(nextRun.getDate() + daysUntilNext);

    // Random status (80% active, 20% paused)
    const status = Math.random() < 0.8 ? 'active' : 'paused';

    const template = {
      business: businessId,
      template: {
        clientName: templateData.client,
        templateName: templateData.templateName,
        amount: templateData.amount,
        description: `${templateData.templateName} for ${templateData.client}`,
      },
      everyDays: templateData.everyDays,
      nextRun: nextRun,
      status: status,
    };

    await RecurringTemplate.create(template);
    const frequency = templateData.everyDays === 7 ? 'Weekly' : 
                     templateData.everyDays === 14 ? 'Bi-Weekly' :
                     templateData.everyDays === 30 ? 'Monthly' : 
                     templateData.everyDays === 90 ? 'Quarterly' : 
                     templateData.everyDays === 365 ? 'Yearly' : `${templateData.everyDays} days`;
    
    console.log(`   ✅ ${templateData.templateName} - ₹${templateData.amount.toLocaleString()} (${frequency}, ${status})`);
  }
}

populateRecurringInvoices();
