const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator/check');

const auth = require('../../middleware/auth');
const checkObjectId = require('../../middleware/checkObjectId');

const User = require('../../models/Usuario');

router.get('/:id', [auth, checkObjectId('id')], async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    res.json(user);
  } catch (err) {
    console.error(err.message);

    res.status(500).send('Server Error');
  }
});

router.post(
  '/',
  [
    check('nome', 'Nome é obrigatório')
      .not()
      .isEmpty(),
    check('email', 'Por favor, inclua um e-mail valido').isEmail(),
    check(
      'senha',
      'Senha deve conter no minimo 6 caracteres'
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ mensagem: errors.array() });
    }

    const { nome, email, senha, telefones } = req.body;    

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ mensagem: 'Usuário já existe' });
      }

      user = new User({
        nome,
        email,        
        senha,
        telefones
      });

      const salt = await bcrypt.genSalt(10);

      user.senha = await bcrypt.hash(senha, salt);
      user.data_criacao = Date.now();
      user.data_atualizacao = Date.now();
      user.ultimo_login = Date.now();

      await user.save();

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;

          const jsonReturn = {
            'id': user.id,
            'nome': user.nome,
            'email': user.email,        
            'data_criacao': user.data_criacao,
            'data_atualiacao': user.data_atualizacao,
            'ultimo_login': user.ultimo_login,            
            'token': token
          }
          res.json(jsonReturn);
          console.log('token foi gerado com sucesso');
        }
      );

    } catch (err) {
      console.error(err.message);
      res.status(500).json({'mensagem':'Ocorreu um erro: ' + err.message});
    }
  }
);

module.exports = router;
