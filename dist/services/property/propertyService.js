"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryProperties = queryProperties;
exports.getPropertyBySlug = getPropertyBySlug;
const Property_js_1 = require("../../models/Property.js");
async function queryProperties(filters) {
    const query = {};
    // Default to ACTIVE for public discovery unless specified
    if (filters.status) {
        query.status = filters.status;
    }
    else {
        query.status = 'ACTIVE';
    }
    if (filters.purpose) {
        const p = String(filters.purpose).toUpperCase();
        if (p === 'COMMERCIAL_RENT') {
            query.purpose = 'RENT';
            query.propertyType = { $in: [/^office/i, /^retail/i, /^warehouse/i, /^commercial/i, /^full floor/i, /^whole building/i] };
        }
        else if (p === 'COMMERCIAL_BUY') {
            query.purpose = 'BUY';
            query.propertyType = { $in: [/^office/i, /^retail/i, /^warehouse/i, /^commercial/i, /^full floor/i, /^whole building/i] };
        }
        else {
            query.purpose = p;
        }
    }
    if (filters.propertyType) {
        const types = String(filters.propertyType).split(',').map((t) => t.trim()).filter(Boolean);
        if (types.length === 1) {
            query.propertyType = new RegExp(`^${types[0]}$`, 'i');
        }
        else if (types.length > 1) {
            query.propertyType = { $in: types.map((t) => new RegExp(`^${t}$`, 'i')) };
        }
    }
    if (filters.community) {
        const communities = String(filters.community).split(',').map((c) => c.trim()).filter(Boolean);
        if (communities.length === 1) {
            query.community = new RegExp(communities[0], 'i');
        }
        else if (communities.length > 1) {
            query.community = { $in: communities.map((c) => new RegExp(c, 'i')) };
        }
    }
    if (filters.developer) {
        query.developer = new RegExp(String(filters.developer), 'i');
    }
    if (filters.furnishing && filters.furnishing !== 'ALL') {
        query.furnishing = filters.furnishing;
    }
    if (filters.completionStatus) {
        query.completionStatus = filters.completionStatus;
    }
    if (filters.rentalFrequency || filters.rentalPeriod) {
        const freq = String(filters.rentalFrequency || filters.rentalPeriod).toUpperCase();
        query.rentalFrequency = freq;
    }
    if (filters.luxuryCollection) {
        query.luxuryCollection = new RegExp(filters.luxuryCollection, 'i');
    }
    if (filters.isFeatured !== undefined) {
        query.isFeatured = filters.isFeatured;
    }
    if (filters.isNewLaunch !== undefined) {
        query.isNewLaunch = filters.isNewLaunch;
    }
    if (filters.bedrooms !== undefined && filters.bedrooms !== '') {
        const beds = String(filters.bedrooms).split(',').map((b) => b.trim()).filter(Boolean);
        const bedQueries = beds.map((b) => {
            if (b.toLowerCase() === 'studio' || b === '0')
                return { bedrooms: 0 };
            if (b.includes('+')) {
                const num = parseInt(b, 10);
                return { bedrooms: { $gte: isNaN(num) ? 7 : num } };
            }
            const num = parseInt(b, 10);
            return isNaN(num) ? null : { bedrooms: num };
        }).filter(Boolean);
        if (bedQueries.length === 1) {
            Object.assign(query, bedQueries[0]);
        }
        else if (bedQueries.length > 1) {
            if (query.$or) {
                query.$and = [{ $or: query.$or }, { $or: bedQueries }];
                delete query.$or;
            }
            else {
                query.$or = bedQueries;
            }
        }
    }
    if (filters.bathrooms !== undefined && filters.bathrooms !== '') {
        const baths = String(filters.bathrooms).split(',').map((b) => b.trim()).filter(Boolean);
        const bathQueries = baths.map((b) => {
            if (b.includes('+')) {
                const num = parseInt(b, 10);
                return { bathrooms: { $gte: isNaN(num) ? 7 : num } };
            }
            const num = parseInt(b, 10);
            return isNaN(num) ? null : { bathrooms: num };
        }).filter(Boolean);
        if (bathQueries.length === 1) {
            Object.assign(query, bathQueries[0]);
        }
        else if (bathQueries.length > 1) {
            if (query.$or) {
                query.$and = [{ $or: query.$or }, { $or: bathQueries }];
                delete query.$or;
            }
            else {
                query.$or = bathQueries;
            }
        }
    }
    if (filters.minPrice || filters.maxPrice) {
        query.priceAED = query.priceAED || {};
        if (filters.minPrice)
            query.priceAED.$gte = Number(filters.minPrice);
        if (filters.maxPrice)
            query.priceAED.$lte = Number(filters.maxPrice);
    }
    if (filters.minArea || filters.maxArea) {
        query.builtUpAreaSqFt = query.builtUpAreaSqFt || {};
        if (filters.minArea)
            query.builtUpAreaSqFt.$gte = Number(filters.minArea);
        if (filters.maxArea)
            query.builtUpAreaSqFt.$lte = Number(filters.maxArea);
    }
    if (filters.amenities) {
        const amList = Array.isArray(filters.amenities)
            ? filters.amenities
            : String(filters.amenities).split(',').map((a) => a.trim()).filter(Boolean);
        if (amList.length > 0) {
            query.amenities = { $in: amList };
        }
    }
    if (filters.search || filters.keywords) {
        const rawSearch = filters.search || filters.keywords;
        const searchRegex = new RegExp(rawSearch, 'i');
        const searchCond = [
            { title: searchRegex },
            { community: searchRegex },
            { developer: searchRegex },
            { location: searchRegex },
            { propertyType: searchRegex },
            { description: searchRegex },
            { amenities: searchRegex }
        ];
        if (query.$or) {
            query.$and = [{ $or: query.$or }, { $or: searchCond }];
            delete query.$or;
        }
        else {
            query.$or = searchCond;
        }
    }
    const page = Math.max(1, Number(filters.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(filters.limit) || 12));
    const skip = (page - 1) * limit;
    let sortCriteria = { createdAt: -1 };
    if (filters.sort === 'price_asc')
        sortCriteria = { priceAED: 1 };
    else if (filters.sort === 'price_desc')
        sortCriteria = { priceAED: -1 };
    else if (filters.sort === 'beds_desc')
        sortCriteria = { bedrooms: -1 };
    const [properties, totalCount] = await Promise.all([
        Property_js_1.Property.find(query)
            .populate({
            path: 'assignedBroker',
            select: 'reraNumber brn title photoUrl bio languages rating experienceYears agencyName whatsappNumber'
        })
            .sort(sortCriteria)
            .skip(skip)
            .limit(limit),
        Property_js_1.Property.countDocuments(query)
    ]);
    return {
        properties,
        pagination: {
            total: totalCount,
            page,
            limit,
            totalPages: Math.ceil(totalCount / limit)
        }
    };
}
async function getPropertyBySlug(slug) {
    return Property_js_1.Property.findOne({ slug })
        .populate({
        path: 'assignedBroker',
        select: 'reraNumber brn title photoUrl bio languages rating experienceYears agencyName whatsappNumber'
    });
}
