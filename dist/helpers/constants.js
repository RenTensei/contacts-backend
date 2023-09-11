"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tempStoragePath = exports.avatarStoragePath = void 0;
const node_path_1 = __importDefault(require("node:path"));
exports.avatarStoragePath = node_path_1.default.join(__dirname, '../', '../', 'public', 'avatars');
exports.tempStoragePath = node_path_1.default.join(__dirname, '../', '../', 'temp', 'avatars');
