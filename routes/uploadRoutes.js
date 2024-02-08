// routes/uploadRoutes.js
const express = require('express');
const multer = require('multer');
const Documento = require('../models/Documento');
const xlsx = require('xlsx'); // Se você estiver lidando com arquivos Excel

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send('Nenhum arquivo foi enviado.');
  }

  try {
    // Verifica se já existe um documento com o mesmo nome no banco de dados
    const existingDocumento = await Documento.findOne({ nome: file.originalname });
    if (existingDocumento) {
      return res.status(400).json({ message: 'Este arquivo já foi processado anteriormente.' });
    }

    const workbook = xlsx.readFile(file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    const documento = new Documento({
      nome: file.originalname,
      dados: data,
    });

    const savedDocumento = await documento.save();
    res.send({ message: 'Arquivo foi carregado e os dados foram salvos no banco de dados.', documentoId: savedDocumento._id });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao processar o arquivo');
  }
});

module.exports = router;
