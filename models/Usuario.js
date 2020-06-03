const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  senha: {
    type: String,
    required: true,
  },
  telefones: [
    {
      ddd: {
        type: String,
        required: true,
        length: 2,
      },
      numero: {
        type: String,
        required: true,
        min: 8,
        max: 9,
      },
    },
  ],
  data_criacao: {
    type: Date,
  },
  data_atualizacao: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('usuario', UsuarioSchema);
