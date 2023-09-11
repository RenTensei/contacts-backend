"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const _helpers_1 = require("../helpers/index.js");
const isValidId = (req, _res, next) => {
    const { contactId } = req.params;
    if ((0, mongoose_1.isValidObjectId)(contactId)) {
        next();
    }
    else {
        next(new _helpers_1.HttpError(400, `${contactId} is not a valid id!`));
    }
};
exports.default = isValidId;
