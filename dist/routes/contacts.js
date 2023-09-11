"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contacts_1 = __importDefault(require("../controllers/contacts"));
const _middlewares_1 = require("../middlewares/index.js");
const router = (0, express_1.Router)();
router.get('/', _middlewares_1.authMiddleware, contacts_1.default.getAll);
router.get('/:contactId', _middlewares_1.authMiddleware, _middlewares_1.validIdMiddleware, contacts_1.default.getById);
router.post('/', _middlewares_1.authMiddleware, contacts_1.default.post);
router.put('/:contactId', _middlewares_1.authMiddleware, _middlewares_1.validIdMiddleware, contacts_1.default.putById);
router.patch('/:contactId', _middlewares_1.authMiddleware, _middlewares_1.validIdMiddleware, contacts_1.default.patchById);
router.delete('/:contactId', _middlewares_1.authMiddleware, _middlewares_1.validIdMiddleware, contacts_1.default.deleteById);
exports.default = router;
