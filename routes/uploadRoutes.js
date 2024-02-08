const express = require('express');
const multer = require('multer');
const Documento = require('../models/Documento');
const xlsx = require('xlsx');
const moment = require('moment'); // Certifique-se de ter instalado a biblioteca moment

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send('Nenhum arquivo foi enviado.');
  }

  try {
    const existingDocumento = await Documento.findOne({ nome: file.originalname });
    if (existingDocumento) {
      return res.status(400).json({ message: 'Este arquivo já foi processado anteriormente.' });
    }

    const workbook = xlsx.readFile(file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 }); // Use { header: 1 } para obter dados como array de arrays

    // Remove o cabeçalho da planilha
    data.shift(); // Remove a primeira linha (cabeçalho)
    data.shift(); // Remove a segunda linha, que agora é a primeira após o primeiro shift()

    // Função para converter data do Excel (OADate) para data JavaScript
    function excelDateToJSDate(serial) {
      const utc_days = Math.floor(serial - 25569);
      const utc_value = utc_days * 86400;                                        
      const date_info = new Date(utc_value * 1000);
  
      // Corrige a data considerando o fuso horário UTC para evitar deslocamentos indesejados
      const correctedDate = new Date(date_info.getTime() + (date_info.getTimezoneOffset() * 60000));
  
      // Formata a data para o formato desejado (DD-MM-YYYY) usando moment.js
      return moment(correctedDate).format('DD-MM-YYYY');
    }
  
    // Mapeia os dados para o formato desejado
    const mapeamentoDados = data.map((row) => ({
      "Controle Target": row[0],
      "Data de Solicitação": excelDateToJSDate(row[1]), // Já retorna 'DD-MM-YYYY'
      "Data de Início":  excelDateToJSDate(row[2]),
      "Solicitante": row[3],
      "Grupo": row[4],
      "Cliente": row[5],
      "CNPJ": row[6],
      "Município": row[7],
      "UF": row[8],
      "Deliberação": row[9],
      "Ato Societário": row[10],
      "Quantidade de impressão": row[11],
      "Complexidade do Processo": row[12],
      "Setor": row[13],
      "Executor": row[14],
      "Serviço": row[15],
      "SLA": row[16],
      "Cumprimento de SLA": row[17],
      "Data do Protocolo": excelDateToJSDate(row[18]),
      "Protocolo": row[19],
      "Registro": row[20],
      "Status": row[21],
      "MÊS": row[22],
      "Período Processual": row[23],
      "Data de Finalização": excelDateToJSDate(row[24]),
      "Codigo - Faturamento": row[25],
      "STATUS": row[26],
      "NF": row[27]
    }));

    // Salva cada documento mapeado no banco de dados
    for (const documento of mapeamentoDados) {
      const novoDocumento = new Documento({
        nome: file.originalname,
        dados: documento
      });
      await novoDocumento.save();
    }

    res.json({ message: 'Todos os registros foram processados e salvos com sucesso.' });
  } catch (error) {
    console.error('Erro ao processar o arquivo:', error);
    res.status(500).json({ message: 'Erro ao processar o arquivo', error: error.toString() });
  }
});

module.exports = router;