"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailValidationSchema = exports.UserValidationSchema = void 0;
const zod_1 = require("zod");
exports.UserValidationSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string()
});
exports.EmailValidationSchema = zod_1.z.object({
    email: zod_1.z.string().email()
});
