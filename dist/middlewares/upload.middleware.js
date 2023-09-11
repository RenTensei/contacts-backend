"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const _helpers_1 = require("../helpers/index.js");
const multerConfig = multer_1.default.diskStorage({
    destination: _helpers_1.constants.tempStoragePath,
    filename: (req, file, cb) => {
        const fileExtension = file.originalname.split('.').pop();
        cb(null, `${req.body.user._id}_avatar.${fileExtension}`);
    }
});
const upload = (0, multer_1.default)({
    storage: multerConfig
});
exports.default = upload;
