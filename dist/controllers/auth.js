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
const node_crypto_1 = __importDefault(require("node:crypto"));
const promises_1 = __importDefault(require("node:fs/promises"));
const node_path_1 = __importDefault(require("node:path"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const gravatar_1 = __importDefault(require("gravatar"));
const jimp_1 = __importDefault(require("jimp"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const _helpers_1 = require("../helpers/index.js");
const User_1 = require("../models/User/User");
const user_schema_1 = require("../models/User/user.schema");
const _services_1 = require("../services/index.js");
const { JWT_SECRET = '' } = process.env;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validatedBody = user_schema_1.UserValidationSchema.parse(req.body);
    const existingUserEmail = yield User_1.UserModel.findOne({
        email: validatedBody.email
    });
    if (existingUserEmail)
        throw new _helpers_1.HttpError(409, 'Email already in use');
    const hashedPassword = yield bcryptjs_1.default.hash(validatedBody.password, 10);
    const avatarURL = gravatar_1.default.url(validatedBody.email);
    const verificationToken = node_crypto_1.default.randomUUID();
    const newUser = yield User_1.UserModel.create({
        email: validatedBody.email,
        password: hashedPassword,
        avatarURL,
        verificationToken
    });
    const response = yield _services_1.mailService.sendMail(validatedBody.email, verificationToken);
    // eslint-disable-next-line no-console
    console.log(response.accepted);
    res.status(201).json({
        user: { email: newUser.email, subscription: newUser.subscription },
        verificationToken
    });
});
const verify = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { verificationToken } = req.params;
    const user = yield User_1.UserModel.findOneAndUpdate({ verificationToken }, { verify: true, verificationToken: null });
    if (!user)
        throw new _helpers_1.HttpError(404, 'Not found');
    res.status(200).json({ message: 'Verification successful' });
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validatedBody = user_schema_1.UserValidationSchema.parse(req.body);
    const existingUser = yield User_1.UserModel.findOne({
        email: validatedBody.email,
        verify: true
    });
    if (!existingUser || !existingUser.password)
        throw new _helpers_1.HttpError(401, 'Email or password is wrong / Accound not verified!');
    const passwordMatches = yield bcryptjs_1.default.compare(validatedBody.password, existingUser.password);
    if (!passwordMatches)
        throw new _helpers_1.HttpError(401, 'Email or password is wrong');
    const token = jsonwebtoken_1.default.sign({ id: existingUser._id }, JWT_SECRET, {
        expiresIn: '24h'
    });
    existingUser.token = token;
    existingUser.save();
    res.json({
        token,
        user: {
            email: existingUser.email,
            subscription: existingUser.subscription
        }
    });
});
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.UserModel.findById(req.body.user._id);
    if (!user)
        throw new jsonwebtoken_1.default.JsonWebTokenError('Logout failed!');
    user.token = null;
    yield user.save();
    res.status(204).send();
});
const current = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({
        email: req.body.user.email,
        subscription: req.body.user.subscription
    });
});
const resend = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validatedBody = user_schema_1.EmailValidationSchema.parse(req.body);
    const user = yield User_1.UserModel.findOne({
        email: validatedBody.email,
        verify: false
    });
    if (!user)
        throw new _helpers_1.HttpError(400, 'Verification has already been passed');
    const verificationToken = node_crypto_1.default.randomUUID();
    user.verificationToken = verificationToken;
    yield user.save();
    const response = yield _services_1.mailService.sendMail(user.email, verificationToken);
    // eslint-disable-next-line no-console
    console.log(response.accepted);
    res.json({ message: 'Verification email sent' });
});
const updateAvatar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file)
        throw new _helpers_1.HttpError(400, 'File attachment is missing');
    const { filename, path: tempPath } = req.file;
    const stablePath = node_path_1.default.join(_helpers_1.constants.avatarStoragePath, filename);
    const image = yield jimp_1.default.read(tempPath);
    image.resize(250, 250).write(stablePath);
    yield promises_1.default.unlink(tempPath);
    const avatarURL = node_path_1.default.join('avatars', filename);
    yield User_1.UserModel.findByIdAndUpdate(req.body.user._id, { avatarURL });
    res.json({ avatarURL });
});
exports.default = {
    register: (0, _helpers_1.handlerWrapper)(register),
    login: (0, _helpers_1.handlerWrapper)(login),
    logout: (0, _helpers_1.handlerWrapper)(logout),
    current: (0, _helpers_1.handlerWrapper)(current),
    verify: (0, _helpers_1.handlerWrapper)(verify),
    resend: (0, _helpers_1.handlerWrapper)(resend),
    updateAvatar: (0, _helpers_1.handlerWrapper)(updateAvatar)
};
