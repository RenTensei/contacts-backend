"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../controllers/auth"));
const _middlewares_1 = require("../middlewares/index.js");
const router = (0, express_1.Router)();
router.post('/register', auth_1.default.register);
router.post('/login', auth_1.default.login);
router.post('/logout', _middlewares_1.authMiddleware, auth_1.default.logout);
router.get('/current', _middlewares_1.authMiddleware, auth_1.default.current);
router.get('/verify/:verificationToken', auth_1.default.verify);
router.post('/verify', auth_1.default.resend);
router.patch('/avatars', _middlewares_1.authMiddleware, _middlewares_1.uploadMiddleware.single('avatar'), auth_1.default.updateAvatar);
exports.default = router;
