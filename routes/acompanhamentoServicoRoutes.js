const express = require('express');
const router = express.Router();

const Documento = require('../models/Documento'); // Ajuste o caminho conforme necessário

router.get('/acompanhamentoServico', async (req, res) => {
    const { filtro } = req.query;
    try {
      // Ajuste a query para buscar no campo 'dados.Controle Target'
      const query = filtro ? { 'dados.Controle Target': filtro } : {};
      const documentos = await Documento.find(query);
      res.status(200).json(documentos);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao realizar a consulta no banco de dados', error });
    }
});

module.exports = router;
