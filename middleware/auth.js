// Things to do for authentication/authorization:
//  - Setup authentication so only that only the request with JWT can access the dashboard request.
// ======================================================================================================

const jwt = require('jsonwebtoken');
const CustomAPIError = require('../errors/custom-error');

const authenticationMiddleware = async (req, res, next) => {
  console.log(req.headers.authorization);
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new CustomAPIError('Authorization Failed.', 401);
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
    throw new CustomAPIError('Not Authorized to access this route.', 401);
  }
};

module.exports = authenticationMiddleware;
