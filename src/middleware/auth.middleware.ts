import { NextFunction, Request, Response } from 'express';
import { Session } from 'express-session';

import config from '../config';
import { logger } from '../logger/log';
import { getAccessToken } from '../utils/getAccessToken';

export interface customSession extends Session {
  token?: string;
  refreshToken?: string
}

export const redirectToAuthorizationUrl = (req: Request, res: Response) => {
  const responseType = req.query.response_type;
  const clientId = config.oidc.clientId;
  const redirectUri = config.oidc.redirectUri;
  const state = req.query.state;
  const audience = config.oidc.audience;

  const authorizationUrl = `https://${config.oidc.domain}/authorize?scope=offline_access&response_type=${responseType}&client_id=${clientId}&redirect_uri=${redirectUri}&audience=${audience}&state=${state}`;
  res.redirect(authorizationUrl);
};

export const handleLogin = async (req: Request, res: Response) => {
  const code = req.query.code as string;
  const token = await getAccessToken('authorization_code', code);
  (req.session as customSession).token = `Bearer ${token}`;
  res.redirect(`http://localhost:${config.app.port}/api-docs`);
};

export const handleLogout = async (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      logger.error(err);
    }
  });
  res.redirect(`http://localhost:${config.app.port}/api-docs`);
};

export const setSessionVariable = (req: Request, res: Response, next: NextFunction) => {
  req.headers.authorization = (req.session as customSession).token || req.headers.authorization;
  next();
}