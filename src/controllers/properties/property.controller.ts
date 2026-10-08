import { Request, Response } from 'express';
import { Property } from '../../models/Property.js';
import { Broker } from '../../models/Broker.js';
import { queryProperties, getPropertyBySlug } from '../../services/property/propertyService.js';
import { AuthenticatedRequest } from '../../middleware/authenticate.js';
import { slugify } from '../../shared/utils/slugify.js';

export async function handleGetProperties(req: Request, res: Response): Promise<void> {
  try {
    const result = await queryProperties(req.query as any);
    res.json({ success: true, ...result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function handleGetFeaturedProperties(req: Request, res: Response): Promise<void> {
  try {
    const properties = await Property.find({ status: 'ACTIVE', isFeatured: true })
      .populate({
        path: 'assignedBroker',
        select: 'reraNumber brn title photoUrl languages rating agencyName'
      })
      .limit(6);
    res.json({ success: true, properties });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function handleGetNewLaunches(req: Request, res: Response): Promise<void> {
  try {
    const properties = await Property.find({ status: 'ACTIVE', isNewLaunch: true })
      .populate({
        path: 'assignedBroker',
        select: 'reraNumber brn title photoUrl languages rating agencyName'
      })
      .limit(6);
    res.json({ success: true, properties });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function handleGetPropertyBySlug(req: Request, res: Response): Promise<void> {
  try {
    const { slug } = req.params;
    const property = await getPropertyBySlug(slug);

    if (!property) {
      res.status(404).json({ success: false, message: 'Property not found' });
      return;
    }

    // Find similar properties in same community or property type
    const similar = await Property.find({
      _id: { $ne: property._id },
      status: 'ACTIVE',
      $or: [{ community: property.community }, { propertyType: property.propertyType }]
    })
      .limit(3)
      .select('title slug priceAED bedrooms bathrooms builtUpAreaSqFt featuredImage community propertyType');

    res.json({
      success: true,
      property,
      similarProperties: similar
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function handleCreateProperty(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const body = req.body;
    let assignedBrokerId = body.assignedBroker;

    // If a broker is creating, automatically bind their broker ID
    if (req.user?.role === 'BROKER') {
      const broker = await Broker.findOne({ user: req.user.id });
      if (!broker) {
        res.status(400).json({ success: false, message: 'Broker profile not found for this user.' });
        return;
      }
      assignedBrokerId = broker._id;
    }

    const slug = body.slug || slugify(body.title) + '-' + Math.floor(1000 + Math.random() * 9000);
    const referenceNumber = body.referenceNumber || `CS-${Math.floor(100000 + Math.random() * 900000)}`;

    const newProperty = await Property.create({
      ...body,
      slug,
      referenceNumber,
      assignedBroker: assignedBrokerId,
      status: req.user?.role === 'ADMIN' ? (body.status || 'ACTIVE') : 'PENDING_APPROVAL'
    });

    res.status(201).json({
      success: true,
      message: 'Property created successfully.',
      property: newProperty
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export async function handleUpdateProperty(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const property = await Property.findById(id);
    if (!property) {
      res.status(404).json({ success: false, message: 'Property not found' });
      return;
    }

    // Broker can only update their own listings
    if (req.user?.role === 'BROKER') {
      const broker = await Broker.findOne({ user: req.user.id });
      if (!broker || property.assignedBroker.toString() !== broker._id.toString()) {
        res.status(403).json({ success: false, message: 'Forbidden. You do not manage this property.' });
        return;
      }
    }

    Object.assign(property, req.body);
    await property.save();

    res.json({ success: true, message: 'Property updated successfully.', property });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export async function handleUpdatePropertyStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { status, isFeatured } = req.body;

    const property = await Property.findById(id);
    if (!property) {
      res.status(404).json({ success: false, message: 'Property not found' });
      return;
    }

    if (status) property.status = status;
    if (isFeatured !== undefined) property.isFeatured = isFeatured;

    await property.save();
    res.json({ success: true, message: `Property status updated to ${status}.`, property });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export async function handleDeleteProperty(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    await Property.findByIdAndDelete(id);
    res.json({ success: true, message: 'Property removed successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}
