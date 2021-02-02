const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(401)
      .send({ message: 'Authorization Required' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    if (process.env.NODE_ENV === 'production') {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } else {
      payload = jwt.verify(token, "secret-key");
    }
    
  } catch (e) {
    const err = new Error('Authorization required');
    err.statusCode = 401;

    next(err);
  }

  req.user = payload;

  next();
}; 