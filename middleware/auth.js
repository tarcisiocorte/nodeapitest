const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {  
  const header = req.headers['authorization']
  const token = header && header.split(' ')[1]
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, config.get('jwtSecret'), (err, user) => {    
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}
