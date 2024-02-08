// routes/dataRoutes.js
const express = require('express');
const router = express.Router();
const Documento = require('../models/Documento'); // Ajuste o caminho conforme necessário

// Rota para buscar e retornar todos os documentos
router.get('/documentos', async (req, res) => {
    try {
      console.log("Buscando documentos...");
      const documentos = await Documento.find();
      console.log("Documentos encontrados:", documentos);
      if (documentos.length > 0) {
        res.json(documentos);
      } else {
        res.status(404).send('Nenhum documento encontrado.');
      }
    } catch (error) {
      console.error("Erro ao buscar documentos:", error);
      res.status(500).send('Erro ao buscar documentos');
    }
});

module.exports = router;