import { Property, IPropertyDocument } from '../../models/Property.js';
import { slugify } from '../../shared/utils/slugify.js';

export interface PropertyQueryFilters {
  purpose?: string;
  propertyType?: string;
  community?: string;
  developer?: string;
  minPrice?: number | string;
  maxPrice?: number | string;
  minArea?: number | string;
  maxArea?: number | string;
  bedrooms?: number | string;
  bathrooms?: number | string;
  rentalFrequency?: string;
  rentalPeriod?: string;
  cheques?: number | string;
  furnishing?: string;
  completionStatus?: string;
  luxuryCollection?: string;
  search?: string;
  keywords?: string;
  isFeatured?: boolean;
  isNewLaunch?: boolean;
  status?: string;
  agent?: string;
  amenities?: string;
  limit?: number;
  page?: number;
  sort?: string;
}

export async function queryProperties(filters: PropertyQueryFilters) {
  const query: any = {};

  // Default to ACTIVE for public discovery unless specified
  if (filters.status) {
    query.status = filters.status;
  } else {
    query.status = 'ACTIVE';
  }

  if (filters.purpose) {
    const p = String(filters.purpose).toUpperCase();
    if (p === 'COMMERCIAL_RENT') {
      query.purpose = 'RENT';
      query.propertyType = { $in: [/^office/i, /^retail/i, /^warehouse/i, /^commercial/i, /^full floor/i, /^whole building/i] };
    } else if (p === 'COMMERCIAL_BUY') {
      query.purpose = 'BUY';
      query.propertyType = { $in: [/^office/i, /^retail/i, /^warehouse/i, /^commercial/i, /^full floor/i, /^whole building/i] };
    } else {
      query.purpose = p;
    }
  }

  if (filters.propertyType) {
    const types = String(filters.propertyType).split(',').map((t) => t.trim()).filter(Boolean);
    if (types.length === 1) {
      query.propertyType = new RegExp(`^${types[0]}$`, 'i');
    } else if (types.length > 1) {
      query.propertyType = { $in: types.map((t) => new RegExp(`^${t}$`, 'i')) };
    }
  }

  if (filters.community) {
    const communities = String(filters.community).split(',').map((c) => c.trim()).filter(Boolean);
    if (communities.length === 1) {
      query.community = new RegExp(communities[0], 'i');
    } else if (communities.length > 1) {
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

  if (filters.rentalFrequency || (filters as any).rentalPeriod) {
    const freq = String(filters.rentalFrequency || (filters as any).rentalPeriod).toUpperCase();
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
      if (b.toLowerCase() === 'studio' || b === '0') return { bedrooms: 0 };
      if (b.includes('+')) {
        const num = parseInt(b, 10);
        return { bedrooms: { $gte: isNaN(num) ? 7 : num } };
      }
      const num = parseInt(b, 10);
      return isNaN(num) ? null : { bedrooms: num };
    }).filter(Boolean);

    if (bedQueries.length === 1) {
      Object.assign(query, bedQueries[0]);
    } else if (bedQueries.length > 1) {
      if (query.$or) {
        query.$and = [{ $or: query.$or }, { $or: bedQueries }];
        delete query.$or;
      } else {
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
    } else if (bathQueries.length > 1) {
      if (query.$or) {
        query.$and = [{ $or: query.$or }, { $or: bathQueries }];
        delete query.$or;
      } else {
        query.$or = bathQueries;
      }
    }
  }

  if (filters.minPrice || filters.maxPrice) {
    query.priceAED = query.priceAED || {};
    if (filters.minPrice) query.priceAED.$gte = Number(filters.minPrice);
    if (filters.maxPrice) query.priceAED.$lte = Number(filters.maxPrice);
  }

  if ((filters as any).minArea || (filters as any).maxArea) {
    query.builtUpAreaSqFt = query.builtUpAreaSqFt || {};
    if ((filters as any).minArea) query.builtUpAreaSqFt.$gte = Number((filters as any).minArea);
    if ((filters as any).maxArea) query.builtUpAreaSqFt.$lte = Number((filters as any).maxArea);
  }

  if ((filters as any).amenities) {
    const amList = Array.isArray((filters as any).amenities)
      ? (filters as any).amenities
      : String((filters as any).amenities).split(',').map((a: string) => a.trim()).filter(Boolean);
    if (amList.length > 0) {
      query.amenities = { $in: amList };
    }
  }

  if (filters.search || (filters as any).keywords) {
    const rawSearch = filters.search || (filters as any).keywords;
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
    } else {
      query.$or = searchCond;
    }
  }

  const page = Math.max(1, Number(filters.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(filters.limit) || 12));
  const skip = (page - 1) * limit;

  let sortCriteria: any = { createdAt: -1 };
  if (filters.sort === 'price_asc') sortCriteria = { priceAED: 1 };
  else if (filters.sort === 'price_desc') sortCriteria = { priceAED: -1 };
  else if (filters.sort === 'beds_desc') sortCriteria = { bedrooms: -1 };

  const [properties, totalCount] = await Promise.all([
    Property.find(query)
      .populate({
        path: 'assignedBroker',
        select: 'reraNumber brn title photoUrl bio languages rating experienceYears agencyName whatsappNumber'
      })
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit),
    Property.countDocuments(query)
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

export async function getPropertyBySlug(slug: string) {
  return Property.findOne({ slug })
    .populate({
      path: 'assignedBroker',
      select: 'reraNumber brn title photoUrl bio languages rating experienceYears agencyName whatsappNumber'
    });
}
