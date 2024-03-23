const express = require('express');
const router = express.Router();
const Documento = require('../models/Documento'); // Ajuste o caminho conforme necessário


// Rota para inserir um novo documento
router.post('/createDocument', async (req, res) => {
  // O body da requisição deve conter os dados do documento que você deseja inserir
  const newDocumentData = req.body;

  try {
    // Cria um novo documento com os dados recebidos
    const newDocument = new Documento(newDocumentData);
    // Salva o documento no banco de dados
    await newDocument.save();

    console.log('Documento inserido com sucesso:', newDocument);
    res.status(201).json(newDocument);
  } catch (error) {
    console.error('Erro ao inserir documento:', error);
    // Um erro comum aqui poderia ser um erro de validação se os dados não corresponderem ao seu esquema
    res.status(500).json({ message: 'Erro ao inserir o documento', error });
  }
});


// Atualizar um registro específico
router.put('/saveRegister/:id', async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  console.log(`Requisição de atualização recebida para o ID: ${id}`);
  console.log('Dados a serem atualizados:', updatedData);

  try {
    // Atualiza o documento no banco de dados
    const updatedDocument = await Documento.findByIdAndUpdate(
      id,
      { $set: updatedData }, // Atualiza diretamente com os dados recebidos
      { new: true, runValidators: true } // Retorna o documento atualizado e executa os validadores
    );

    if (updatedDocument) {
      console.log(`Documento atualizado com sucesso: ${updatedDocument}`);
      res.status(200).json(updatedDocument);
    } else {
      console.log(`Documento com ID: ${id} não encontrado.`);
      res.status(404).json({ message: 'Documento não encontrado' });
    }
  } catch (error) {
    console.error(`Erro ao atualizar documento com ID: ${id}`, error);
    res.status(500).json({ message: 'Erro ao atualizar o documento', error });
  }
});


router.get('/incluireExcluirOperacao', async (req, res) => {
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
