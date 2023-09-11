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
const googleapis_1 = require("googleapis");
const nodemailer_1 = __importDefault(require("nodemailer"));
require('dotenv').config();
const { BASE_URL_PUBLIC, MAILER_EMAIL, MAILER_CLIENT_ID, MAILER_CLIENT_SECRET, MAILER_REFRESH_TOKEN } = process.env;
const getGoogleAccessToken = () => __awaiter(void 0, void 0, void 0, function* () {
    const oauth2Client = new googleapis_1.google.auth.OAuth2(MAILER_CLIENT_ID, MAILER_CLIENT_SECRET, 'https://developers.google.com/oauthplayground');
    oauth2Client.setCredentials({ refresh_token: MAILER_REFRESH_TOKEN });
    const { res } = yield oauth2Client.getAccessToken();
    if (!res)
        throw new Error('google api died');
    const accessToken = res.data.access_token;
    return accessToken;
});
class MailService {
    constructor() {
        this.setupTransporter();
    }
    setupTransporter() {
        return __awaiter(this, void 0, void 0, function* () {
            const accessToken = yield getGoogleAccessToken();
            this.transporter = nodemailer_1.default.createTransport({
                service: 'gmail',
                auth: {
                    type: 'OAuth2',
                    user: MAILER_EMAIL,
                    accessToken,
                    clientId: MAILER_CLIENT_ID,
                    clientSecret: MAILER_CLIENT_SECRET,
                    refreshToken: MAILER_REFRESH_TOKEN
                }
            });
        });
    }
    sendMail(sendTo, verificationToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.transporter.sendMail({
                from: MAILER_EMAIL,
                to: sendTo,
                subject: 'Confirm your email',
                html: `
        <div>
          <h1>Для активации аккаунта перейдите по ссылке: </h1>
          </br>
          <a href="${BASE_URL_PUBLIC}/users/verify/${verificationToken}">
            ${BASE_URL_PUBLIC}/users/verify/${verificationToken}
          </a>
        </div>
      `
            });
        });
    }
}
exports.default = new MailService();
