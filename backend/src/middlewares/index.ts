import jwt from 'jsonwebtoken';
import { jwtSecret } from '../helpers';

export const isAuthenticated = async (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    req.isAuth = false;
    return next();
  }
  const token = authHeader.substr(7);
  if (!token || token == '') {
    req.isAuth = false;
    return next();
  }
  let decodedToken: any;
  try {
    decodedToken = await jwt.verify(token, jwtSecret);
  } catch (error) {
    console.log(error);
    req.isAuth = false;
    return next();
  }
  if (!decodedToken) {
    req.isAuth = false;
    return next();
  }
  req.isAuth = true;
  req.userId = decodedToken.userId;
  next();
};
