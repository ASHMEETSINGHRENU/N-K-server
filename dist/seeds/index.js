"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_js_1 = require("../config/database.js");
const index_js_1 = require("../models/index.js");
const seedData_js_1 = require("./seedData.js");
const dubaiLocations_js_1 = require("../shared/constants/dubaiLocations.js");
async function seed() {
    console.log('--- Starting Crestshore Dubai Database Seeding ---');
    await (0, database_js_1.connectDatabase)();
    // Clear collections
    console.log('Clearing existing collections...');
    await Promise.all([
        index_js_1.User.deleteMany({}),
        index_js_1.Broker.deleteMany({}),
        index_js_1.Client.deleteMany({}),
        index_js_1.Property.deleteMany({}),
        index_js_1.Location.deleteMany({}),
        index_js_1.Community.deleteMany({}),
        index_js_1.Developer.deleteMany({}),
        index_js_1.Lead.deleteMany({}),
        index_js_1.LeadActivity.deleteMany({}),
        index_js_1.Viewing.deleteMany({}),
        index_js_1.Commission.deleteMany({}),
        index_js_1.Insight.deleteMany({}),
        index_js_1.WebsiteContent.deleteMany({})
    ]);
    // 1. Seed Location
    const dubaiLocation = await index_js_1.Location.create({
        name: 'Dubai',
        slug: 'dubai',
        headline: 'The Global Capital of Prime Luxury Living',
        description: 'An international epicenter of architectural prestige, financial security, and coastal opulence.',
        image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80',
        country: 'United Arab Emirates',
        isActive: true
    });
    console.log(`✓ Seeded Location: ${dubaiLocation.name}`);
    // 2. Seed Communities
    const createdCommunities = [];
    for (const comm of dubaiLocations_js_1.DUBAI_COMMUNITIES) {
        const c = await index_js_1.Community.create({
            name: comm.name,
            slug: comm.slug,
            location: dubaiLocation._id,
            tagline: comm.tagline,
            description: comm.description,
            coverImage: comm.highlightImage,
            avgPricePerSqFtAED: comm.avgPricePerSqFt,
            lifestyleTags: ['Luxury', 'Waterfront', 'Private Security', 'Fine Dining'],
            isFeatured: true
        });
        createdCommunities.push(c);
    }
    console.log(`✓ Seeded ${createdCommunities.length} Dubai communities.`);
    // 3. Seed Developers
    const createdDevelopers = [];
    for (const dev of dubaiLocations_js_1.DUBAI_DEVELOPERS) {
        const d = await index_js_1.Developer.create({
            name: dev.name,
            slug: dev.slug,
            coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
            description: `Pioneering developer behind iconic Dubai landmarks including ${dev.flagship}.`,
            establishedYear: 1997,
            flagshipProjects: [dev.flagship],
            isVerified: true
        });
        createdDevelopers.push(d);
    }
    console.log(`✓ Seeded ${createdDevelopers.length} developers.`);
    // 4. Seed Users and Brokers
    const createdBrokers = [];
    const defaultPasswordHash = await bcryptjs_1.default.hash('Admin@123456', 10);
    const brokerPasswordHash = await bcryptjs_1.default.hash('Broker@123456', 10);
    const clientPasswordHash = await bcryptjs_1.default.hash('Client@123456', 10);
    for (const u of seedData_js_1.SEED_USERS) {
        const hash = u.role === 'ADMIN' ? defaultPasswordHash : u.role === 'BROKER' ? brokerPasswordHash : clientPasswordHash;
        const userDoc = await index_js_1.User.create({
            name: u.name,
            email: u.email,
            passwordHash: hash,
            role: u.role,
            phone: u.phone,
            avatar: u.avatar,
            isActive: true
        });
        if (u.role === 'BROKER' && u.brokerProfile) {
            const bp = u.brokerProfile;
            const brokerDoc = await index_js_1.Broker.create({
                user: userDoc._id,
                reraNumber: bp.reraNumber,
                brn: bp.brn,
                agencyName: 'Crestshore Luxury Real Estate LLC',
                title: bp.title,
                photoUrl: u.avatar,
                bio: `Specialized luxury advisor with over ${bp.experienceYears} years advising high-net-worth families in Dubai.`,
                languages: bp.languages,
                specializations: bp.specializations,
                experienceYears: bp.experienceYears,
                totalSalesVolumeAED: bp.totalSalesVolumeAED,
                commissionSplitPct: bp.commissionSplitPct,
                rating: bp.rating,
                reviewsCount: bp.reviewsCount,
                isVerified: true,
                isActive: true,
                whatsappNumber: bp.whatsappNumber
            });
            createdBrokers.push(brokerDoc);
        }
    }
    console.log(`✓ Seeded ${seedData_js_1.SEED_USERS.length} users and ${createdBrokers.length} broker profiles.`);
    // 5. Seed Properties
    const createdProperties = [];
    for (let i = 0; i < seedData_js_1.SEED_PROPERTIES.length; i++) {
        const p = seedData_js_1.SEED_PROPERTIES[i];
        const assignedBroker = createdBrokers[i % createdBrokers.length];
        const propDoc = await index_js_1.Property.create({
            ...p,
            assignedBroker: assignedBroker._id,
            status: 'ACTIVE'
        });
        createdProperties.push(propDoc);
        // Increment broker active listings
        assignedBroker.activeListingsCount = (assignedBroker.activeListingsCount || 0) + 1;
        await assignedBroker.save();
    }
    console.log(`✓ Seeded ${createdProperties.length} luxury properties.`);
    // 6. Seed Leads and Activities
    const sampleLeadSources = ['WEBSITE', 'GOOGLE', 'INSTAGRAM', 'REFERRAL'];
    const sampleStatuses = ['NEW', 'CONTACTED', 'QUALIFIED', 'VIEWING', 'NEGOTIATION', 'CONVERTED'];
    const sampleLeadData = [
        { name: 'Sheikh Mansoor Al-Nahyan', email: 'm.nahyan@investment.ae', mobile: '+971 50 888 1234', budget: 150000000, type: 'VIEWING_REQUEST', msg: 'Interested in private viewing of Palm Jumeirah Signature Villa for family estate.' },
        { name: 'Henrietta De Montmorency', email: 'henrietta@monacofamily.mc', mobile: '+377 98 123 456', budget: 90000000, type: 'SPECIALIST_CALL', msg: 'Requesting confidential information on Bulgari Lighthouse Penthouse triplex.' },
        { name: 'Dr. Alistair Sterling', email: 'sterling.wealth@zurich.ch', mobile: '+41 79 555 8899', budget: 60000000, type: 'INQUIRY', msg: 'Looking for a private golf fairway villa in Dubai Hills Estate with immediate handover.' },
        { name: 'Vikramaditya Singhania', email: 'singhania@mumbaicapital.in', mobile: '+91 98200 44332', budget: 45000000, type: 'CONSULTATION', msg: 'Seeking prime Downtown penthouse with direct Burj Khalifa panoramic vistas.' },
        { name: 'Maximilian Von Weber', email: 'weber@frankfurtprivate.de', mobile: '+49 171 9988776', budget: 40000000, type: 'INQUIRY', msg: 'Inquiring regarding payment schedule and handover on Dorchester Collection.' },
        { name: 'Princess Laila Bint Saud', email: 'private.office@riyadh.sa', mobile: '+966 50 123 7890', budget: 80000000, type: 'VIEWING_REQUEST', msg: 'Private delegation requesting viewing of Emirates Hills Sector L mansion.' }
    ];
    for (let i = 0; i < sampleLeadData.length; i++) {
        const s = sampleLeadData[i];
        const assignedBroker = createdBrokers[i % createdBrokers.length];
        const assignedProperty = createdProperties[i % createdProperties.length];
        const status = sampleStatuses[i % sampleStatuses.length];
        const leadDoc = await index_js_1.Lead.create({
            leadId: `CS-LD-2026-${1000 + i}`,
            name: s.name,
            email: s.email,
            mobile: s.mobile,
            preferredContactMethod: 'WHATSAPP',
            property: assignedProperty._id,
            broker: assignedBroker._id,
            source: sampleLeadSources[i % sampleLeadSources.length],
            leadType: s.type,
            message: s.msg,
            status: status,
            estimatedBudgetAED: s.budget,
            notes: [
                { author: 'SYSTEM', text: 'Inquiry received via online portal.', createdAt: new Date(Date.now() - 86400000 * 3) },
                { author: 'Broker Advisory', text: 'Verified client liquid funds and confirmed VIP viewing readiness.', createdAt: new Date() }
            ],
            lastActivity: new Date()
        });
        await index_js_1.LeadActivity.create({
            lead: leadDoc._id,
            actor: 'SYSTEM',
            type: 'STATUS_CHANGE',
            details: `Lead created online. Status: ${status}`
        });
        // If status is VIEWING, create Viewing appointment
        if (status === 'VIEWING' || status === 'QUALIFIED') {
            await index_js_1.Viewing.create({
                property: assignedProperty._id,
                lead: leadDoc._id,
                broker: assignedBroker._id,
                viewingDate: new Date(Date.now() + 86400000 * 2), // 2 days from now
                viewingTimeSlot: '15:00 - 16:30 GST',
                status: 'CONFIRMED',
                meetingPoint: 'Private Security Gate / Concierge Desk',
                attendeesCount: 2
            });
        }
        // If status is CONVERTED, create Commission record
        if (status === 'CONVERTED') {
            const salePrice = assignedProperty.priceAED;
            const gross = (salePrice * 0.02);
            const net = (gross * 0.65);
            await index_js_1.Commission.create({
                transactionId: `TX-DUBAI-${202600 + i}`,
                property: assignedProperty._id,
                broker: assignedBroker._id,
                salePriceAED: salePrice,
                grossCommissionPct: 2.0,
                grossCommissionAED: gross,
                brokerSplitPct: 65.0,
                netBrokerCommissionAED: net,
                companyCommissionAED: gross - net,
                status: 'APPROVED',
                closedDate: new Date()
            });
        }
    }
    console.log(`✓ Seeded ${sampleLeadData.length} leads with activities, viewings and commissions.`);
    // 7. Seed Insights
    for (const ins of seedData_js_1.SEED_INSIGHTS) {
        await index_js_1.Insight.create({
            ...ins,
            author: {
                name: 'Alexander Sterling',
                role: 'Chief Investment Strategist, Crestshore'
            }
        });
    }
    console.log(`✓ Seeded ${seedData_js_1.SEED_INSIGHTS.length} editorial market insights.`);
    // 8. Seed Website Content (CMS)
    await index_js_1.WebsiteContent.create({
        hero: {
            headline: 'Find Your Place in Dubai',
            subheadline: 'Curated architectural masterpieces, prime beachfront villas, and private sky penthouses for the world’s most discerning individuals.',
            backgroundImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=2000&q=85',
            ctaText: 'Explore Prime Properties',
            ctaLink: '/properties'
        },
        featuredSectionTitle: 'Curated Luxury Residences',
        featuredSectionSubtitle: 'Handpicked prime Dubai properties offering unrivaled architectural grandeur, panoramic views, and prestigious addresses.',
        consultationBanner: {
            title: 'Looking for Something Truly Exceptional?',
            description: 'Our private client advisors hold exclusive off-market listings across Palm Jumeirah, Emirates Hills, and Bulgari Resort Residences.',
            buttonText: 'Speak With a Private Specialist',
            image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80'
        },
        contactInfo: {
            phone: '+971 4 456 7890',
            email: 'private@crestshore.com',
            officeAddress: 'Level 42, ICD Brookfield Place, DIFC, Dubai, United Arab Emirates',
            reraRegistrationNumber: 'RERA ORN 28941',
            trnNumber: '100293848100003',
            operatingHours: 'Monday – Saturday: 09:00 AM – 08:00 PM GST'
        },
        socialLinks: {
            instagram: 'https://instagram.com',
            linkedin: 'https://linkedin.com',
            youtube: 'https://youtube.com',
            whatsapp: 'https://wa.me/971501123456'
        }
    });
    console.log(`✓ Seeded Website CMS content.`);
    console.log('--- Crestshore Database Seeding Finished Successfully! ---');
    await mongoose_1.default.disconnect();
}
seed().catch((err) => {
    console.error('Seeding error:', err);
    process.exit(1);
});
