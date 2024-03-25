import { isTokenValid } from '../utils/jwt.js';

export const authMiddleware = async (req, res, next) => {

  // check first if send in header 
  let token;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer')) {
    token = authHeader.split(' ')[1];
  }

  // otherwise check if sent in cookies
  else if (req.cookies.token) {
    token = req.cookies.token;
  }



  if (!token) {      
    return res.status(401).json({ status: 401, message: 'you are not authenticated' });
  }
  try {
    const payload = isTokenValid(token);
    // do something if not valid 

    req.user = {
      userId: payload.userId,
      role: payload.role,
    };

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ status: 401, message: 'something went wrong ',error });
    }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ status: 403, message: 'access denied for this action' });
    }
    next();
  };
};

export default ( authMiddleware, authorizeRoles );