import { isValidObjectId } from 'mongoose';

import { HttpError } from '@helpers';

import type { RequestHandler } from 'express';

const isValidId: RequestHandler = (req, _res, next) => {
  const { contactId } = req.params;

  if (isValidObjectId(contactId)) {
    next();
  } else {
    next(new HttpError(400, `${contactId} is not a valid id!`));
  }
};

export default isValidId;
