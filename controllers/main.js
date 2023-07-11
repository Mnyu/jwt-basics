// Things to do in Login:
// 1. Check username, password in post request i.e. login.
//      Options :
//        a. Mongoose Validation
//        b. Package - Joi
//        c. Check in controller (implemented below)
// 2. If exists - create a new JWT token.
// 3. Send the token to front-end.
// ======================================================================================================

require('dotenv').config();
const jwt = require('jsonwebtoken');
const { BadRequest } = require('../errors');

const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new BadRequest('Please provide username and password.');
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
  console.log(req.user);
  const luckyNumber = Math.floor(Math.random() * 100);
  res.status(200).json({
    msg: `Hello ${req.user.username}`,
    secret: `Here is your authorized data, your lucky number is ${luckyNumber}`,
  });
};

module.exports = { login, dashboard };
