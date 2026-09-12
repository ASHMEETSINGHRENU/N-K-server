"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudinaryConfig = void 0;
exports.CloudinaryConfig = {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || 'nestandkey',
    apiKey: process.env.CLOUDINARY_API_KEY || 'demo',
    apiSecret: process.env.CLOUDINARY_API_SECRET || 'demo',
    isConfigured: Boolean(process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_KEY !== 'demo')
};
