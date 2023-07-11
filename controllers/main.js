// Things to do :
// 1. Check username, password in post request i.e. login.
//      Options :
//        a. Mongoose Validation
//        b. Package - Joi
//        c. Check in controller (implemented below)
// 2. If exists - create a new JWT token.
// 3. Send the token to front-end.
// 4. Setup authentication so only that only the request with JWT can access the dashboard request.
// ======================================================================================================

require('dotenv').config();
const jwt = require('jsonwebtoken');
const CustomAPIError = require('../errors/custom-error');
const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new CustomAPIError('Please provide username and password.', 400);
  }

  // JWT
  // Payload : { id, username } - try to keep the payload small, better experience for user.
  // Secret JWT_SECRET : just for demo, in prod use long, complex and unguessable string value.
  const id = new Date().getDate(); // just for demo, normally provided by DB.
  const token = jwt.sign({ id, username }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  res.status(200).json({ msg: 'user created', token });
};

const dashboard = async (req, res) => {
  console.log(req.headers);
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new CustomAPIError('Authorization Failed.', 401);
  }
  const token = authHeader.split(' ')[1];
  //console.log(token);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //console.log(decoded);
    const luckyNumber = Math.floor(Math.random() * 100);
    res.status(200).json({
      msg: `Hello ${decoded.username}`,
      secret: `Here is your authorized data, your lucky number is ${luckyNumber}`,
    });
  } catch (error) {
    throw new CustomAPIError('Not Authorized to access this route.', 401);
  }
};

module.exports = { login, dashboard };
