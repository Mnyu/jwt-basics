// Things to do for authentication/authorization:
//  - Setup authentication so only that only the request with JWT can access the dashboard request.
// ======================================================================================================

const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');

const authenticationMiddleware = async (req, res, next) => {
  console.log(req.headers.authorization);
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthenticatedError('Authorization Failed.');
  }
  const token = authHeader.split(' ')[1];
  //console.log(token);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //console.log(decoded);
    const { id, username } = decoded;
    req.user = { id, username };
    next();
  } catch (error) {
    throw new UnauthenticatedError('Not Authorized to access this route.');
  }
};

module.exports = authenticationMiddleware;
