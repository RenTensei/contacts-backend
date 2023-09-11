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
Object.defineProperty(exports, "__esModule", { value: true });
const contact_schema_1 = require("../models/Contact/contact.schema");
const _helpers_1 = require("../helpers/index.js");
const Contact_1 = require("../models/Contact/Contact");
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, limit = 5, favorite = false } = req.query;
    const skip = (page - 1) * limit;
    const contacts = yield Contact_1.Contact.find({ owner: req.body.user._id, favorite }, '-updatedAt -createdAt -owner', {
        skip,
        limit
    });
    res.json(contacts);
});
const getById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { contactId } = req.params;
    const contact = yield Contact_1.Contact.findById(contactId);
    if (!contact)
        throw new _helpers_1.HttpError(404, 'Not found');
    res.json(contact);
});
const post = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validatedBody = contact_schema_1.UpdateContactDataSchema.parse(req.body);
    const addedContact = yield Contact_1.Contact.create(Object.assign(Object.assign({}, validatedBody), { owner: req.body.user._id }));
    res.status(201).json(addedContact);
});
const putById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { contactId } = req.params;
    const validatedBody = contact_schema_1.UpdateContactDataSchema.parse(req.body);
    const updatedContact = yield Contact_1.Contact.findByIdAndUpdate(contactId, validatedBody, { new: true });
    if (!updatedContact)
        throw new _helpers_1.HttpError(404, 'Not found');
    res.json(updatedContact);
});
const patchById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { contactId } = req.params;
    const validatedBody = contact_schema_1.UpdateFavoriteSchema.parse(req.body);
    const updatedContact = yield Contact_1.Contact.findByIdAndUpdate(contactId, validatedBody, { new: true });
    if (!updatedContact)
        throw new _helpers_1.HttpError(404, 'Not found');
    res.json(updatedContact);
});
const deleteById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { contactId } = req.params;
    const removedContact = yield Contact_1.Contact.findByIdAndDelete(contactId);
    if (!removedContact)
        throw new _helpers_1.HttpError(404, 'Not found');
    res.json({ message: 'contact deleted' });
});
exports.default = {
    getAll: (0, _helpers_1.handlerWrapper)(getAll),
    getById: (0, _helpers_1.handlerWrapper)(getById),
    post: (0, _helpers_1.handlerWrapper)(post),
    putById: (0, _helpers_1.handlerWrapper)(putById),
    patchById: (0, _helpers_1.handlerWrapper)(patchById),
    deleteById: (0, _helpers_1.handlerWrapper)(deleteById)
};
