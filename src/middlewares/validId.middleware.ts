import { isValidObjectId } from 'mongoose';
import { HttpError } from '../helpers';
import type { RequestHandler } from 'express';

const isValidId: RequestHandler = (req, _res, next) => {
  const contactId = req.params.contactId;
  isValidObjectId(contactId) ? next() : next(new HttpError(400, `${contactId} is not a valid id!`));
};

export default isValidId;
