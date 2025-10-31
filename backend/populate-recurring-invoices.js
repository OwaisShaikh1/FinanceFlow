require('dotenv').config();
const mongoose = require('mongoose');

const RecurringTemplate = require('./models/RecuringTemplate');
const Business = require('./models/Business');
const User = require('./models/User');

const connectDB = mongoose
  .connect(process.env.MONGODB_URI, { 
    dbName: 'Finance',
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  })
  .then(() => {
    console.log('✅ MongoDB Atlas connected');
    return true;
  })
  .catch((e) => {
    console.error('❌ MongoDB Atlas connection error:', e.message);
    process.exit(1);
  });

// Template types with different frequencies and amounts
const templateTypes = [
  { name: 'Monthly Retainer', everyDays: 30, baseAmount: 25000 },
  { name: 'Quarterly Consulting', everyDays: 90, baseAmount: 75000 },
  { name: 'Annual Maintenance', everyDays: 365, baseAmount: 120000 },
  { name: 'Weekly Support', everyDays: 7, baseAmount: 8000 },
  { name: 'Bi-Weekly Service', everyDays: 14, baseAmount: 15000 },
  { name: 'Half-Yearly Review', everyDays: 180, baseAmount: 50000 },
  { name: 'Monthly Subscription', everyDays: 30, baseAmount: 18000 },
  { name: 'Quarterly License', everyDays: 90, baseAmount: 60000 },
];

async function populateRecurringInvoices() {
  try {
    await connectDB;
    console.log('🔗 Connected to MongoDB\n');

    // Get all businesses with their owners
    const businesses = await Business.find().populate('owner', 'name email').lean();
    console.log(`📊 Found ${businesses.length} businesses in database`);

    if (businesses.length === 0) {
      console.log('⚠️  No businesses found in database!');
      console.log('💡 Please run populate-multi-client-data.js first');
      return;
    }

    let totalCreated = 0;
    const existingTemplates = await RecurringTemplate.countDocuments();
    
    if (existingTemplates > 0) {
      console.log(`\n⚠️  Found ${existingTemplates} existing templates. Clearing them...`);
      await RecurringTemplate.deleteMany({});
      console.log('✅ Cleared existing templates');
    }

    for (const business of businesses) {
      const ownerName = business.owner?.name || 'Unknown';
      const ownerEmail = business.owner?.email || 'unknown';
      
      console.log(`\n🏢 Creating templates for ${business.name}`);
      console.log(`   Owner: ${ownerName} (${ownerEmail})`);

      // Generate 2-4 unique recurring templates per business
      const numTemplates = Math.floor(Math.random() * 3) + 2; // 2 to 4 templates
      
      // Shuffle and pick random templates
      const shuffled = [...templateTypes].sort(() => 0.5 - Math.random());
      const selectedTemplates = shuffled.slice(0, numTemplates);

      for (const templateType of selectedTemplates) {
        // Add randomness to amount (±20%)
        const variance = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
        const amount = Math.round(templateType.baseAmount * variance);

        // Random next run date (within next 30 days)
        const daysUntilNext = Math.floor(Math.random() * 30) + 1;
        const nextRun = new Date();
        nextRun.setDate(nextRun.getDate() + daysUntilNext);

        // Random status (85% active, 15% paused)
        const status = Math.random() < 0.85 ? 'active' : 'paused';

        const template = {
          user: business.owner?._id || business.owner, // Add user reference
          business: business._id,
          template: {
            clientName: business.name,
            templateName: templateType.name,
            amount: amount,
            description: `${templateType.name} for ${business.name}`,
            invoicePrefix: `REC-${business.name.substring(0, 3).toUpperCase()}`,
          },
          everyDays: templateType.everyDays,
          nextRun: nextRun,
          status: status,
        };

        await RecurringTemplate.create(template);
        
        const frequency = templateType.everyDays === 7 ? 'Weekly' : 
                         templateType.everyDays === 14 ? 'Bi-Weekly' :
                         templateType.everyDays === 30 ? 'Monthly' : 
                         templateType.everyDays === 90 ? 'Quarterly' : 
                         templateType.everyDays === 180 ? 'Half-Yearly' :
                         templateType.everyDays === 365 ? 'Yearly' : 
                         `${templateType.everyDays} days`;
        
        console.log(`   ✅ ${templateType.name} - ₹${amount.toLocaleString()} (${frequency}, ${status})`);
        totalCreated++;
      }
    }

    console.log(`\n🎉 Successfully created ${totalCreated} recurring invoice templates!`);
    console.log('\n📋 Summary by Business:');
    
    const allTemplates = await RecurringTemplate.find().populate('business', 'name');
    const byBusiness = {};
    
    allTemplates.forEach(template => {
      const businessName = template.business?.name || 'Unknown';
      if (!byBusiness[businessName]) {
        byBusiness[businessName] = {
          count: 0,
          templates: [],
          totalMonthlyRevenue: 0
        };
      }
      byBusiness[businessName].count++;
      byBusiness[businessName].templates.push({
        name: template.template.templateName,
        amount: template.template.amount,
        frequency: template.everyDays,
        status: template.status
      });
      
      // Calculate monthly revenue equivalent
      if (template.status === 'active') {
        const monthlyEquivalent = (template.template.amount / template.everyDays) * 30;
        byBusiness[businessName].totalMonthlyRevenue += monthlyEquivalent;
      }
    });

    Object.entries(byBusiness).forEach(([business, data]) => {
      console.log(`\n   📌 ${business}: ${data.count} templates`);
      data.templates.forEach(t => {
        const freq = t.frequency === 7 ? 'Weekly' : 
                    t.frequency === 14 ? 'Bi-Weekly' :
                    t.frequency === 30 ? 'Monthly' : 
                    t.frequency === 90 ? 'Quarterly' : 
                    t.frequency === 180 ? 'Half-Yearly' :
                    t.frequency === 365 ? 'Yearly' : 
                    `${t.frequency}d`;
        console.log(`      • ${t.name}: ₹${t.amount.toLocaleString()} (${freq}) [${t.status}]`);
      });
      console.log(`      💰 Est. Monthly Revenue: ₹${Math.round(data.totalMonthlyRevenue).toLocaleString()}`);
    });

    console.log(`\n✨ Total recurring templates: ${allTemplates.length}`);
    const activeCount = allTemplates.filter(t => t.status === 'active').length;
    const pausedCount = allTemplates.filter(t => t.status === 'paused').length;
    console.log(`   Active: ${activeCount} | Paused: ${pausedCount}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Disconnected from MongoDB');
    process.exit(0);
  }
}

populateRecurringInvoices();
