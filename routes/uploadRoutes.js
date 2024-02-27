const express = require('express');
const multer = require('multer');
const Documento = require('../models/Documento');
const xlsx = require('xlsx');
const moment = require('moment');
const fs = require('fs').promises; // Para leitura assíncrona de arquivos

const router = express.Router();

// Filtragem de arquivos para aceitar apenas arquivos Excel
const fileFilter = (req, file, cb) => {
  if (file.mimetype.includes("excel") || file.mimetype.includes("spreadsheetml")) {
    cb(null, true);
  } else {
    cb(new Error("Apenas arquivos Excel são permitidos."), false);
  }
};

const upload = multer({ dest: 'uploads/', fileFilter });

// Função para converter data do Excel (OADate) para data JavaScript
function excelDateToJSDate(serial) {
  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400;
  const date_info = new Date(utc_value * 1000);
  const correctedDate = new Date(date_info.getTime() + (date_info.getTimezoneOffset() * 60000));
  return moment(correctedDate).format('DD-MM-YYYY');
}

router.post('/upload', upload.single('file'), async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send('Nenhum arquivo foi enviado.');
  }

  try {
    const buffer = await fs.readFile(file.path);
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

    // Remove os cabeçalhos
    data.shift(); // Remove a primeira linha (cabeçalho)
    data.shift(); // Remove a segunda linha, que agora é a primeira após o primeiro shift()

    const mapeamentoDados = data.map((row) => ({
      "Controle Target": row[0],
      "Data de Solicitação": excelDateToJSDate(row[1]),
      "Data de Início": excelDateToJSDate(row[2]),
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

    // Operação em massa para salvar os documentos
    await Documento.insertMany(mapeamentoDados.map(dado => ({
      nome: file.originalname,
      dados: dado
    })));

    res.json({ message: 'Todos os registros foram processados e salvos com sucesso.' });
  } catch (error) {
    console.error('Erro ao processar o arquivo:', error);
    res.status(500).json({ message: 'Erro ao processar o arquivo', error: error.toString() });
  } finally {
    // Assegura que o arquivo seja deletado após o processamento
    await fs.unlink(file.path);
  }
});

module.exports = router;
