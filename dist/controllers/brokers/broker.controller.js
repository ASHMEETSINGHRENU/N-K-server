"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGetBrokers = handleGetBrokers;
exports.handleGetAllBrokersAdmin = handleGetAllBrokersAdmin;
exports.handleGetBrokerProfile = handleGetBrokerProfile;
exports.handleCreateBroker = handleCreateBroker;
exports.handleUpdateBroker = handleUpdateBroker;
const Broker_js_1 = require("../../models/Broker.js");
const User_js_1 = require("../../models/User.js");
const Property_js_1 = require("../../models/Property.js");
const authService_js_1 = require("../../services/auth/authService.js");
async function handleGetBrokers(req, res) {
    try {
        const brokers = await Broker_js_1.Broker.find({ isActive: true })
            .populate('user', 'name avatar')
            .select('-reraNumber -commissionSplitPct'); // Hide internal license/split details for public directory
        res.json({ success: true, brokers });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
async function handleGetAllBrokersAdmin(req, res) {
    try {
        const brokers = await Broker_js_1.Broker.find().populate('user', 'name email phone avatar isActive');
        res.json({ success: true, brokers });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
async function handleGetBrokerProfile(req, res) {
    try {
        const broker = await Broker_js_1.Broker.findOne({ user: req.user?.id }).populate('user');
        if (!broker) {
            res.status(404).json({ success: false, message: 'Broker profile not found' });
            return;
        }
        const properties = await Property_js_1.Property.find({ assignedBroker: broker._id });
        res.json({ success: true, broker, properties });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
async function handleCreateBroker(req, res) {
    try {
        const { name, email, password, reraNumber, brn, title, photoUrl, languages, specializations, commissionSplitPct } = req.body;
        const existingUser = await User_js_1.User.findOne({ email: email.toLowerCase().trim() });
        if (existingUser) {
            res.status(400).json({ success: false, message: 'User with this email already exists.' });
            return;
        }
        const passwordHash = await (0, authService_js_1.hashPassword)(password || 'Broker@123456');
        const user = await User_js_1.User.create({
            name,
            email: email.toLowerCase().trim(),
            passwordHash,
            role: 'BROKER',
            isActive: true
        });
        const broker = await Broker_js_1.Broker.create({
            user: user._id,
            reraNumber,
            brn: brn || `BRN-${Math.floor(10000 + Math.random() * 90000)}`,
            title: title || 'Private Client Advisor',
            photoUrl: photoUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
            languages: languages || ['English', 'Arabic'],
            specializations: specializations || ['Palm Jumeirah', 'Penthouses'],
            commissionSplitPct: commissionSplitPct || 60,
            isActive: true,
            isVerified: true
        });
        res.status(201).json({ success: true, message: 'Broker created successfully', broker });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}
async function handleUpdateBroker(req, res) {
    try {
        const { id } = req.params;
        const broker = await Broker_js_1.Broker.findById(id);
        if (!broker) {
            res.status(404).json({ success: false, message: 'Broker not found' });
            return;
        }
        Object.assign(broker, req.body);
        await broker.save();
        res.json({ success: true, message: 'Broker updated successfully', broker });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}
