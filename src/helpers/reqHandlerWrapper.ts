import type { RequestHandler } from 'express';

export default (requestHandler: RequestHandler<any, any, any, any>): RequestHandler => {
  return async (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch(next);
  };
};
