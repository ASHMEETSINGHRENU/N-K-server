"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGetProperties = handleGetProperties;
exports.handleGetFeaturedProperties = handleGetFeaturedProperties;
exports.handleGetNewLaunches = handleGetNewLaunches;
exports.handleGetPropertyBySlug = handleGetPropertyBySlug;
exports.handleCreateProperty = handleCreateProperty;
exports.handleUpdateProperty = handleUpdateProperty;
exports.handleUpdatePropertyStatus = handleUpdatePropertyStatus;
exports.handleDeleteProperty = handleDeleteProperty;
const Property_js_1 = require("../../models/Property.js");
const Broker_js_1 = require("../../models/Broker.js");
const propertyService_js_1 = require("../../services/property/propertyService.js");
const slugify_js_1 = require("../../shared/utils/slugify.js");
async function handleGetProperties(req, res) {
    try {
        const result = await (0, propertyService_js_1.queryProperties)(req.query);
        res.json({ success: true, ...result });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
async function handleGetFeaturedProperties(req, res) {
    try {
        const properties = await Property_js_1.Property.find({ status: 'ACTIVE', isFeatured: true })
            .populate({
            path: 'assignedBroker',
            select: 'reraNumber brn title photoUrl languages rating agencyName'
        })
            .limit(6);
        res.json({ success: true, properties });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
async function handleGetNewLaunches(req, res) {
    try {
        const properties = await Property_js_1.Property.find({ status: 'ACTIVE', isNewLaunch: true })
            .populate({
            path: 'assignedBroker',
            select: 'reraNumber brn title photoUrl languages rating agencyName'
        })
            .limit(6);
        res.json({ success: true, properties });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
async function handleGetPropertyBySlug(req, res) {
    try {
        const { slug } = req.params;
        const property = await (0, propertyService_js_1.getPropertyBySlug)(slug);
        if (!property) {
            res.status(404).json({ success: false, message: 'Property not found' });
            return;
        }
        // Find similar properties in same community or property type
        const similar = await Property_js_1.Property.find({
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
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
async function handleCreateProperty(req, res) {
    try {
        const body = req.body;
        let assignedBrokerId = body.assignedBroker;
        // If a broker is creating, automatically bind their broker ID
        if (req.user?.role === 'BROKER') {
            const broker = await Broker_js_1.Broker.findOne({ user: req.user.id });
            if (!broker) {
                res.status(400).json({ success: false, message: 'Broker profile not found for this user.' });
                return;
            }
            assignedBrokerId = broker._id;
        }
        const slug = body.slug || (0, slugify_js_1.slugify)(body.title) + '-' + Math.floor(1000 + Math.random() * 9000);
        const referenceNumber = body.referenceNumber || `CS-${Math.floor(100000 + Math.random() * 900000)}`;
        const newProperty = await Property_js_1.Property.create({
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
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}
async function handleUpdateProperty(req, res) {
    try {
        const { id } = req.params;
        const property = await Property_js_1.Property.findById(id);
        if (!property) {
            res.status(404).json({ success: false, message: 'Property not found' });
            return;
        }
        // Broker can only update their own listings
        if (req.user?.role === 'BROKER') {
            const broker = await Broker_js_1.Broker.findOne({ user: req.user.id });
            if (!broker || property.assignedBroker.toString() !== broker._id.toString()) {
                res.status(403).json({ success: false, message: 'Forbidden. You do not manage this property.' });
                return;
            }
        }
        Object.assign(property, req.body);
        await property.save();
        res.json({ success: true, message: 'Property updated successfully.', property });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}
async function handleUpdatePropertyStatus(req, res) {
    try {
        const { id } = req.params;
        const { status, isFeatured } = req.body;
        const property = await Property_js_1.Property.findById(id);
        if (!property) {
            res.status(404).json({ success: false, message: 'Property not found' });
            return;
        }
        if (status)
            property.status = status;
        if (isFeatured !== undefined)
            property.isFeatured = isFeatured;
        await property.save();
        res.json({ success: true, message: `Property status updated to ${status}.`, property });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}
async function handleDeleteProperty(req, res) {
    try {
        const { id } = req.params;
        await Property_js_1.Property.findByIdAndDelete(id);
        res.json({ success: true, message: 'Property removed successfully.' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
