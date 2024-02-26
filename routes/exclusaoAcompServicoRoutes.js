const express = require('express');
const router = express.Router();
const Documento = require('../models/Documento'); // Ajuste o caminho conforme necessário

// Rota para excluir todos os documentos
router.delete('/api/documentos', async (req, res) => {
  try {
    await Documento.deleteMany({}); // Isso exclui todos os documentos
    res.status(200).send("Documentos excluídos com sucesso.");
  } catch (error) {
    console.error("Erro ao excluir documentos:", error);
    res.status(500).send("Erro ao excluir documentos.");
  }
});

module.exports = router;
