/* eslint-disable consistent-return */
const express = require('express');

const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator/check');
const auth = require('../../middleware/auth');

const User = require('../../models/Usuario');

router.get('/', auth, async (req, res) => {
  try {
    const usuario = await User.findById(req.user.id).select('-senha');
    res.json(usuario);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});


router.post(
  '/',
  [
    check('email', 'E-mail é obrigatório').isEmail(),
    check('senha', 'Senha é obrigatório').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ mensagem: errors.array() });
    }

    const { email, senha } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res
          .status(401)
          .json({ mensagem: 'Usuário e/ou senha inválidos' });
      }

      const isMatch = await bcrypt.compare(senha, user.senha);

      if (!isMatch) {
        return res
          .status(401)
          .json({ mensagem: 'Usuário e/ou senha inválidos' });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: '1800000' },
        (err, token) => {
          if (err) throw err;
          const jsonReturn = {
            id: user.id,
            nome: user.nome,
            email: user.email,
            data_criacao: user.data_criacao,
            data_atualiacao: user.data_atualizacao,
            token,
          };
          return res.json(jsonReturn);
        },
      );
    } catch (err) {
      res.status(500).send('Server error');
    }
  },
);

module.exports = router;
