"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const _helpers_1 = require("../helpers/index.js");
const User_1 = require("../models/User/User");
const { JWT_SECRET = '' } = process.env;
const authMiddleware = (req, _, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization || '';
    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token)
        throw new jsonwebtoken_1.default.JsonWebTokenError('Invalid token');
    const { id } = jsonwebtoken_1.default.verify(token, JWT_SECRET);
    const user = yield User_1.UserModel.findById(id);
    if (!user || user.token !== token)
        throw new jsonwebtoken_1.default.JsonWebTokenError('Invalid token');
    req.body.user = user;
    next();
});
exports.default = (0, _helpers_1.handlerWrapper)(authMiddleware);