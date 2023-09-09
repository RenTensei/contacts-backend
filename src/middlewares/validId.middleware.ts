import { isValidObjectId } from 'mongoose';
import type { RequestHandler } from 'express';
import { HttpError } from '../helpers';

const isValidId: RequestHandler = (req, _res, next) => {
  const { contactId } = req.params;

  if (isValidObjectId(contactId)) {
    next();
  } else {
    next(new HttpError(400, `${contactId} is not a valid id!`));
  }
};

export default isValidId;
