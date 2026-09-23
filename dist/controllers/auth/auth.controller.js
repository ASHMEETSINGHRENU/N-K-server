"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleRegister = handleRegister;
exports.handleLogin = handleLogin;
exports.handleGetMe = handleGetMe;
exports.handleGetUsers = handleGetUsers;
exports.handleUpdateUserStatus = handleUpdateUserStatus;
exports.handleUpdateProfile = handleUpdateProfile;
exports.handleChangePassword = handleChangePassword;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const authService_js_1 = require("../../services/auth/authService.js");
const User_js_1 = require("../../models/User.js");
const Broker_js_1 = require("../../models/Broker.js");
async function handleRegister(req, res) {
    try {
        const { name, email, password, role, phone } = req.body;
        if (!name || !email || !password) {
            res.status(400).json({ success: false, message: 'Name, email and password are required.' });
            return;
        }
        const result = await (0, authService_js_1.registerUser)({ name, email, password, role, phone });
        res.status(201).json({
            success: true,
            message: 'Account created successfully.',
            ...result
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}
async function handleLogin(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ success: false, message: 'Email and password are required.' });
            return;
        }
        const result = await (0, authService_js_1.authenticateUser)(email, password);
        // If user is a broker, find associated Broker record ID
        let brokerId;
        if (result.user.role === 'BROKER') {
            const broker = await Broker_js_1.Broker.findOne({ user: result.user._id });
            if (broker)
                brokerId = broker._id.toString();
        }
        res.json({
            success: true,
            message: 'Logged in successfully.',
            ...result,
            brokerId
        });
    }
    catch (error) {
        res.status(401).json({ success: false, message: error.message });
    }
}
async function handleGetMe(req, res) {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Not authenticated' });
            return;
        }
        const user = await User_js_1.User.findById(req.user.id);
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        let brokerProfile = null;
        if (user.role === 'BROKER') {
            brokerProfile = await Broker_js_1.Broker.findOne({ user: user._id });
        }
        res.json({
            success: true,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                avatar: user.avatar,
                brokerProfile
            }
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
async function handleGetUsers(req, res) {
    try {
        const users = await User_js_1.User.find().select('-passwordHash').sort({ createdAt: -1 });
        res.json({ success: true, users });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
async function handleUpdateUserStatus(req, res) {
    try {
        const { id } = req.params;
        const { role, isActive } = req.body;
        const updateData = {};
        if (role)
            updateData.role = role;
        if (typeof isActive === 'boolean')
            updateData.isActive = isActive;
        const user = await User_js_1.User.findByIdAndUpdate(id, updateData, { new: true }).select('-passwordHash');
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        res.json({ success: true, user });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
async function handleUpdateProfile(req, res) {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Not authenticated' });
            return;
        }
        const { name, phone, avatar } = req.body;
        const user = await User_js_1.User.findById(req.user.id);
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        if (name)
            user.name = name.trim();
        if (phone !== undefined)
            user.phone = phone.trim();
        if (avatar !== undefined)
            user.avatar = avatar.trim();
        await user.save();
        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                avatar: user.avatar
            }
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}
async function handleChangePassword(req, res) {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Not authenticated' });
            return;
        }
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            res.status(400).json({ success: false, message: 'Current and new password are required.' });
            return;
        }
        if (newPassword.length < 8) {
            res.status(400).json({ success: false, message: 'New password must be at least 8 characters long.' });
            return;
        }
        const user = await User_js_1.User.findById(req.user.id).select('+passwordHash');
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            res.status(400).json({ success: false, message: 'Current password is incorrect.' });
            return;
        }
        user.passwordHash = await bcryptjs_1.default.hash(newPassword, 10);
        await user.save();
        res.json({ success: true, message: 'Password changed successfully.' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
