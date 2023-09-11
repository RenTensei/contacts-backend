"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contact = void 0;
const mongoose_1 = require("mongoose");
const contactSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    favorite: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'user'
    }
}, { versionKey: false, timestamps: true });
// eslint-disable-next-line import/prefer-default-export
exports.Contact = (0, mongoose_1.model)('Contact', contactSchema);
