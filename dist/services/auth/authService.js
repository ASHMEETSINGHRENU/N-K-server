"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.registerUser = registerUser;
exports.authenticateUser = authenticateUser;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_js_1 = require("../../models/User.js");
const jwt_js_1 = require("../../config/jwt.js");
async function hashPassword(password) {
    const salt = await bcryptjs_1.default.genSalt(10);
    return bcryptjs_1.default.hash(password, salt);
}
async function registerUser(data) {
    const existingUser = await User_js_1.User.findOne({ email: data.email.toLowerCase() });
    if (existingUser) {
        throw new Error('An account with this email address already exists.');
    }
    const passwordHash = await hashPassword(data.password);
    const user = await User_js_1.User.create({
        name: data.name,
        email: data.email.toLowerCase(),
        passwordHash,
        role: data.role || 'CLIENT',
        phone: data.phone,
        isActive: true
    });
    const token = (0, jwt_js_1.generateToken)({
        userId: user._id.toString(),
        role: user.role,
        email: user.email
    });
    const refreshToken = (0, jwt_js_1.generateRefreshToken)({
        userId: user._id.toString(),
        role: user.role,
        email: user.email
    });
    return {
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone
        },
        token,
        refreshToken
    };
}
async function authenticateUser(email, password) {
    const cleanEmail = dataClean(email);
    let user = await User_js_1.User.findOne({ email: cleanEmail }).select('+passwordHash');
    if (!user) {
        if (cleanEmail.endsWith('@crestshore.com')) {
            const legacyEmail = cleanEmail.replace('@crestshore.com', '@nestandkey.com');
            user = await User_js_1.User.findOne({ email: legacyEmail }).select('+passwordHash');
        }
        else if (cleanEmail.endsWith('@nestandkey.com')) {
            const newEmail = cleanEmail.replace('@nestandkey.com', '@crestshore.com');
            user = await User_js_1.User.findOne({ email: newEmail }).select('+passwordHash');
        }
    }
    if (!user) {
        throw new Error('Invalid email or password.');
    }
    if (!user.isActive) {
        throw new Error('Account has been suspended or deactivated.');
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw new Error('Invalid email or password.');
    }
    user.lastLogin = new Date();
    await user.save();
    const token = (0, jwt_js_1.generateToken)({
        userId: user._id.toString(),
        role: user.role,
        email: user.email
    });
    const refreshToken = (0, jwt_js_1.generateRefreshToken)({
        userId: user._id.toString(),
        role: user.role,
        email: user.email
    });
    return {
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone
        },
        token,
        refreshToken
    };
}
function dataClean(val) {
    return val.trim().toLowerCase();
}
