"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateFavoriteSchema = exports.UpdateContactDataSchema = exports.ContactDataSchema = void 0;
const zod_1 = require("zod");
exports.ContactDataSchema = zod_1.z.object({
    _id: zod_1.z.string(),
    name: zod_1.z.string(),
    email: zod_1.z.string().email(),
    phone: zod_1.z.string(),
    favorite: zod_1.z.boolean()
});
exports.UpdateContactDataSchema = zod_1.z.object({
    name: zod_1.z.string(),
    email: zod_1.z.string().email(),
    phone: zod_1.z.string()
});
exports.UpdateFavoriteSchema = zod_1.z.object({
    favorite: zod_1.z.boolean()
});
