const express = require('express');
const router = express.Router();
const Documento = require('../models/Documento'); // Ajuste o caminho conforme necessário

router.get('/data', async (req, res) => {
  try {
    const data = await Documento.find(); // Buscar todos os dados, ajuste conforme necessário
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
