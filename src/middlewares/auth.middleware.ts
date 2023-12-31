import jwt from 'jsonwebtoken';

import { handlerWrapper } from '@helpers';
import { UserModel } from '@models/User/User';

import type { IJwtPayLoad } from '@/types/payload.type';
import type { RequestHandler } from 'express';

const { JWT_SECRET = '' } = process.env;

const authMiddleware: RequestHandler = async (req, _, next) => {
  const authHeader = req.headers.authorization || '';

  const [bearer, token] = authHeader.split(' ');
  if (bearer !== 'Bearer' || !token) throw new jwt.JsonWebTokenError('Invalid token');

  const { id } = jwt.verify(token, JWT_SECRET) as IJwtPayLoad;

  const user = await UserModel.findById(id);
  if (!user || user.token !== token) throw new jwt.JsonWebTokenError('Invalid token');

  req.body.user = user;

  next();
};

export default handlerWrapper(authMiddleware);
