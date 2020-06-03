/* eslint-disable consistent-return */
/* eslint-disable func-names */
const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
  const header = req.headers.authorization;
  const token = header && header.split(' ')[1];
  if (token == null) return res.status(403).json({ mensgem: 'Não autorizado' });

  jwt.verify(token, config.get('jwtSecret'), (err, user) => {
    if (err) return res.status(403).json({ mensgem: 'Não autorizado' });
    req.user = user;
    next();
  });
};
