"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGetClients = handleGetClients;
exports.handleCreateClient = handleCreateClient;
exports.handleGetClientById = handleGetClientById;
const Client_js_1 = require("../../models/Client.js");
const Broker_js_1 = require("../../models/Broker.js");
async function handleGetClients(req, res) {
    try {
        const query = {};
        if (req.user?.role === 'BROKER') {
            const broker = await Broker_js_1.Broker.findOne({ user: req.user.id });
            if (broker)
                query.assignedBroker = broker._id;
        }
        const clients = await Client_js_1.Client.find(query).sort({ updatedAt: -1 });
        res.json({ success: true, count: clients.length, clients });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
async function handleCreateClient(req, res) {
    try {
        let brokerId = req.body.assignedBroker;
        if (req.user?.role === 'BROKER') {
            const broker = await Broker_js_1.Broker.findOne({ user: req.user.id });
            if (broker)
                brokerId = broker._id;
        }
        const client = await Client_js_1.Client.create({
            ...req.body,
            assignedBroker: brokerId
        });
        res.status(201).json({ success: true, message: 'Client profile created', client });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}
async function handleGetClientById(req, res) {
    try {
        const { id } = req.params;
        const client = await Client_js_1.Client.findById(id).populate('assignedBroker');
        if (!client) {
            res.status(404).json({ success: false, message: 'Client profile not found' });
            return;
        }
        res.json({ success: true, client });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
