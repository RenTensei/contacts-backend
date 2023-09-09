import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

import jwt from 'jsonwebtoken';
import gravatar from 'gravatar';
import Jimp from 'jimp';
import bcrypt from 'bcryptjs';

import { constants, handlerWrapper, HttpError } from '@helpers';
import { mailService } from '@services';
import { UserModel } from '@models/User/User';
import type { RequestHandler } from 'express';
import type { AuthRequestHandler } from '@/types/user.type';
import { EmailValidationSchema, UserValidationSchema } from '@/models/User/user.schema';

const { JWT_SECRET = '' } = process.env;

const register: RequestHandler = async (req, res) => {
  const validatedBody = UserValidationSchema.parse(req.body);

  const existingUserEmail = await UserModel.findOne({
    email: validatedBody.email
  });
  if (existingUserEmail) throw new HttpError(409, 'Email already in use');

  const hashedPassword = await bcrypt.hash(validatedBody.password, 10);
  const avatarURL = gravatar.url(validatedBody.email);
  const verificationToken = crypto.randomUUID();

  const newUser = await UserModel.create({
    email: validatedBody.email,
    password: hashedPassword,
    avatarURL,
    verificationToken
  });

  const response = await mailService.sendMail(validatedBody.email, verificationToken);
  // eslint-disable-next-line no-console
  console.log(response.accepted);

  res.status(201).json({
    user: { email: newUser.email, subscription: newUser.subscription },
    verificationToken
  });
};

const verify: RequestHandler = async (req, res) => {
  const { verificationToken } = req.params;

  const user = await UserModel.findOneAndUpdate(
    { verificationToken },
    { verify: true, verificationToken: null }
  );
  if (!user) throw new HttpError(404, 'Not found');

  res.status(200).json({ message: 'Verification successful' });
};

const login: AuthRequestHandler = async (req, res) => {
  const validatedBody = UserValidationSchema.parse(req.body);

  const existingUser = await UserModel.findOne({
    email: validatedBody.email,
    verify: true
  });
  if (!existingUser || !existingUser.password)
    throw new HttpError(401, 'Email or password is wrong / Accound not verified!');

  const passwordMatches = await bcrypt.compare(validatedBody.password, existingUser.password);
  if (!passwordMatches) throw new HttpError(401, 'Email or password is wrong');

  const token = jwt.sign({ id: existingUser._id }, JWT_SECRET, {
    expiresIn: '24h'
  });

  existingUser.token = token;
  existingUser.save();

  res.json({
    token,
    user: {
      email: existingUser.email,
      subscription: existingUser.subscription
    }
  });
};

const logout: AuthRequestHandler = async (req, res) => {
  const user = await UserModel.findById(req.body.user._id);
  if (!user) throw new jwt.JsonWebTokenError('Logout failed!');

  user.token = null;
  await user.save();
  res.status(204).send();
};

const current: AuthRequestHandler = async (req, res) => {
  res.json({
    email: req.body.user.email,
    subscription: req.body.user.subscription
  });
};

const resend: RequestHandler = async (req, res) => {
  const validatedBody = EmailValidationSchema.parse(req.body);
  const user = await UserModel.findOne({
    email: validatedBody.email,
    verify: false
  });
  if (!user) throw new HttpError(400, 'Verification has already been passed');

  const verificationToken = crypto.randomUUID();
  user.verificationToken = verificationToken;
  await user.save();

  const response = await mailService.sendMail(user.email, verificationToken);
  // eslint-disable-next-line no-console
  console.log(response.accepted);

  res.json({ message: 'Verification email sent' });
};

const updateAvatar: AuthRequestHandler = async (req, res) => {
  if (!req.file) throw new HttpError(400, 'File attachment is missing');
  const { filename, path: tempPath } = req.file;

  const stablePath = path.join(constants.avatarStoragePath, filename);

  const image = await Jimp.read(tempPath);
  image.resize(250, 250).write(stablePath);
  await fs.unlink(tempPath);

  const avatarURL = path.join('avatars', filename);
  await UserModel.findByIdAndUpdate(req.body.user._id, { avatarURL });

  res.json({ avatarURL });
};

export default {
  register: handlerWrapper(register),
  login: handlerWrapper(login),
  logout: handlerWrapper(logout),
  current: handlerWrapper(current),
  verify: handlerWrapper(verify),
  resend: handlerWrapper(resend),
  updateAvatar: handlerWrapper(updateAvatar)
};
