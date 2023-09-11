"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = require("jsonwebtoken");
const morgan_1 = __importDefault(require("morgan"));
const zod_1 = require("zod");
const zod_validation_error_1 = require("zod-validation-error");
const auth_1 = __importDefault(require("./routes/auth"));
const contacts_1 = __importDefault(require("./routes/contacts"));
const _helpers_1 = require("./helpers/index.js");
const app = (0, express_1.default)();
const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';
app.use((0, morgan_1.default)(formatsLogger));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.static('public'));
// apply routes
app.use('/api/contacts', contacts_1.default);
app.use('/api/users', auth_1.default);
// non-existing route
app.use((_, res) => {
    res.status(404).json({ message: 'Route not found!' });
});
// error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err, _req, res, _next) => {
    if (err instanceof _helpers_1.HttpError) {
        return res.status(err.status).json({ message: err.message });
    }
    if (err instanceof zod_1.ZodError) {
        return res.status(400).json({
            message: 'missing fields',
            details: (0, zod_validation_error_1.fromZodError)(err).message
        });
    }
    if (err instanceof jsonwebtoken_1.JsonWebTokenError) {
        return res.status(401).json({ message: 'Not authorized' });
    }
    // eslint-disable-next-line no-console
    console.log(err.message);
    return res.status(500).json({ message: 'Internal Server Error. Try again later!' });
});
exports.default = app;
