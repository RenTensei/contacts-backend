import type { Request, RequestHandler } from 'express';
import type { ObjectId } from 'mongodb';
// import type { Document } from 'mongoose';

export interface IUser {
  _id: ObjectId;
  password: string;
  email: string;
  subscription: 'starter' | 'pro' | 'business';
  token: string | null;
  avatarURL: string;
  verify: boolean;
  verificationToken: string | null;
}

export type AuthRequestHandler<
  Params = {},
  ResBody = {},
  ReqBody = {},
  ParsedQs = {}
> = RequestHandler<Params, ResBody, { user: IUser } & ReqBody, ParsedQs>;
