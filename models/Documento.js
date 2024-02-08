// models/Documento.js
const mongoose = require('mongoose');

const documentoSchema = new mongoose.Schema({
  nome: String,
  dados: mongoose.Schema.Types.Mixed, // Para dados variáveis da planilha
  criadoEm: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Documento', documentoSchema);
