const express = require('express');
const router = express.Router();

const Documento = require('../models/Documento'); // Ajuste o caminho conforme necessário

router.get('/acompanhamentoServico', async (req, res) => {
    const { filtro } = req.query;
    try {
      // Construa uma query que busca o filtro em múltiplos campos
      let query = {};
      if (filtro) {
        query = {
          $or: [
            { 'dados.Controle Target': { $regex: filtro, $options: 'i' } },
            { 'dados.Solicitante': { $regex: filtro, $options: 'i' } },
            { 'dados.Cliente': { $regex: filtro, $options: 'i' } },
            { 'dados.CNPJ': { $regex: filtro, $options: 'i' } },
            { 'dados.Município': { $regex: filtro, $options: 'i' } },
            { 'dados.UF': { $regex: filtro, $options: 'i' } },
            { 'dados.Deliberação': { $regex: filtro, $options: 'i' } },
            { 'dados.Ato Societário': { $regex: filtro, $options: 'i' } },
            { 'dados.Quantidade de impressão': { $regex: filtro, $options: 'i' } },
            { 'dados.Complexidade do Processo': { $regex: filtro, $options: 'i' } },
            { 'dados.Setor': { $regex: filtro, $options: 'i' } },
            { 'dados.Executor': { $regex: filtro, $options: 'i' } },
            { 'dados.Serviço': { $regex: filtro, $options: 'i' } },
            { 'dados.SLA': { $regex: filtro, $options: 'i' } },
            { 'dados.Cumprimento de SLA': { $regex: filtro, $options: 'i' } },
            { 'dados.Data do Protocolo': { $regex: filtro, $options: 'i' } },
            { 'dados.Protocolo': { $regex: filtro, $options: 'i' } },
            { 'dados.Registro': { $regex: filtro, $options: 'i' } },
            { 'dados.Status': { $regex: filtro, $options: 'i' } },
            { 'dados.MÊS': { $regex: filtro, $options: 'i' } },
            { 'dados.Período Processual': { $regex: filtro, $options: 'i' } },
            { 'dados.Data de Finalização': { $regex: filtro, $options: 'i' } },
            { 'dados.STATUS': { $regex: filtro, $options: 'i' } },
            { 'dados.NF': { $regex: filtro, $options: 'i' } },
            // Adicione outras condições conforme necessário
          ]
        };
      }
      const documentos = await Documento.find(query);
      res.status(200).json(documentos);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao realizar a consulta no banco de dados', error });
    }
});

module.exports = router;
