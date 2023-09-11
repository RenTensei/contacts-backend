"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    subscription: {
        type: String,
        enum: ['starter', 'pro', 'business'],
        default: 'starter'
    },
    token: {
        type: String,
        default: null
    },
    avatarURL: {
        type: String,
        required: true
    },
    verify: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String,
        default: null
    }
}, { versionKey: false, timestamps: true });
// eslint-disable-next-line import/prefer-default-export
exports.UserModel = (0, mongoose_1.model)('User', userSchema);
