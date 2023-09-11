"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-console */
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
require('dotenv').config();
const { MONGO_CONNECTION_STRING, API_PORT, PRODUCTION_PORT, NODE_ENV } = process.env;
const APP_PORT = NODE_ENV === 'production' ? PRODUCTION_PORT : API_PORT;
console.log(APP_PORT);
mongoose_1.default
    .connect(MONGO_CONNECTION_STRING || '')
    .then(() => {
    console.log('Database connection successful');
    app_1.default.listen(APP_PORT, () => {
        console.log(`Server running. Use API on port: ${APP_PORT}`);
    });
})
    .catch((err) => {
    if (err instanceof Error) {
        console.log(err);
    }
    process.exit(1);
});
